# A DICOMweb-Native AI Orchestration Gateway for Radiology

**Mohit Kumar**
Researcher in Healthcare IT, PACS & Networking

---

## Abstract

The deployment of artificial intelligence in clinical radiology remains bottlenecked not by model performance, but by interoperability — the absence of a standards-native pathway that moves a DICOM study from a PACS to a model and returns a machine-readable, reviewable result. This paper presents a DICOMweb-native AI orchestration gateway that closes that gap. Built on DICOM PS3.18 (STOW-RS, WADO-RS, QIDO-RS) and HL7 FHIR R4, the gateway implements a four-layer pipeline — ingestion, model-agnostic inference, structured-result serialization, and report-grounding verification — designed to run on commodity hardware with zero cloud dependency. A four-experiment evaluation protocol (E1–E4) measures end-to-end latency, segmentation accuracy, finding-level grounding fidelity, and interoperability round-trip integrity. Live evaluation on the reference stack yields a p95 ingest-to-result latency of 41 ms, throughput of 79.7 requests per second, Dice = 0.696 and HD95 = 1.0 voxel on synthetic chest CT segmentation, perfect finding-level grounding under zero report mismatch, and full StudyInstanceUID preservation across STOW-RS → inference → DICOM SR → FHIR → QIDO-RS round-trips. These results demonstrate that a fully local, standards-compliant orchestration layer is viable for radiology AI deployment today.

**Keywords:** DICOMweb, AI orchestration, PACS interoperability, radiology informatics, STOW-RS, WADO-RS, QIDO-RS, FHIR, structured reporting, model-agnostic inference

---

## 1. Introduction

Clinical radiology is experiencing an artificial-intelligence inflection point: deep-learning models for detection, segmentation, and classification now match or exceed radiologist performance on curated benchmarks [1, 2]. Yet translation into routine clinical workflow remains slow. The dominant bottleneck is not algorithmic — it is *interoperability*. A model trained on axial chest CT cannot easily consume a study from a hospital PACS, produce a result, and deliver that result back into the radiologist's existing workflow in a standards-compliant, reviewable form [3, 4].

This integration gap has three dimensions. **Ingestion**: DICOM studies arrive in heterogeneous formats — raw `.dcm` files, DICOMweb `multipart/related` payloads, or proprietary PACS query responses — and converting between these representations without metadata loss is non-trivial. **Execution**: model-serving stacks are typically built around TorchServe, TensorFlow Serving, or ONNX Runtime, none of which natively understand DICOM or radiology workflow semantics. Bridging the PACS-to-model handoff requires brittle, one-off glue code. **Output**: the result of an AI inference — a segmentation mask, structured findings, a probability score — must be serialized into a format that downstream systems (PACS archives, reporting engines, EHRs) can consume.

We introduce the **DICOMweb-Native AI Orchestration Gateway**, a self-hosted, open-source service that addresses all three dimensions through a single, model-agnostic pipeline. The gateway accepts DICOM instances via standard DICOMweb PS3.18 operations, routes them to pluggable inference workers, and emits structured results as JSON, DICOM SR, and HL7 FHIR R4 transaction Bundles. A fourth layer — report grounding — reconciles machine-produced findings against the radiologist's free-text report, flagging matched, unsupported, or contradicted findings. The entire stack runs on commodity hardware (x86_64, 6 GB VRAM or less) with no cloud dependency.

The primary contributions are:

1. A production-reference implementation of a DICOMweb-native AI orchestration architecture, released under the MIT license.
2. A model-agnostic worker contract (`BaseModelWorker`) that isolates model logic from transport, storage, and serialization.
3. A four-experiment evaluation protocol (E1–E4) benchmarking end-to-end latency, segmentation accuracy (Dice, HD95), finding-level grounding fidelity, and interoperability round-trip integrity.
4. Demonstrated viability of a fully local, CPU-capable orchestration layer with p95 latency of 41 ms and 79.7 requests-per-second throughput on synthetic chest CT workloads.

---

## 2. Background

### 2.1 DICOMweb and Structured Reporting

DICOMweb (DICOM PS3.18) defines a RESTful binding to the DICOM information model using standard HTTP verbs and media types [5]. Three operations are central:

- **STOW-RS** (`POST /studies`): stores DICOM instances delivered as a `multipart/related` payload — the standard for pushing studies from modalities or AI clients into an archive.
- **WADO-RS** (`GET /studies/{study}/instances/{series}/{instance}`): retrieves raw DICOM instance bytes, enabling downstream access to pixel data without a PACS.
- **QIDO-RS** (`GET /studies`): provides lightweight study-level search.

DICOM SR (PS3.3) and HL7 FHIR Diagnostic Imaging profiles are the two primary standards for encoding structured radiology findings [6, 7]. DICOM SR uses a hierarchical content tree (TID 1500) with coded entries from SNOMED-CT, DCM, and LOINC. FHIR R4 `DiagnosticReport` and `Observation` resources provide a JSON-native alternative for EHR integration.

### 2.2 Model-Agnostic Orchestration

General-purpose ML serving stacks — TorchServe, Triton Inference Server, KServe — lack radiology-specific primitives: DICOM parsing, pixel-data extraction, SNOMED-coded finding generation, and report-grounding verification. The gateway fills this niche by embedding these primitives in a radiology-aware orchestration layer while preserving the ability to swap any model behind a worker interface.

### 2.3 Report Grounding

Grounding — reconciling machine-generated findings against a human-authored source — is emerging as a critical trust mechanism in clinical AI [8, 9]. The gateway's dual-engine design (offline keyword engine + optional local LLM engine) ensures deterministic, auditable behavior on CPU-only hardware while offering nuanced semantic reconciliation when resources permit.

---

## 3. Methods

### 3.1 Experimental Protocol

We evaluate the gateway against a four-experiment protocol:

**E1 — Latency and Throughput** measures end-to-end time from STOW-RS ingestion through inference completion. We report p50, p95, and p99 latency and throughput in requests per second (RPS), running against a live gateway instance on the reference hardware (Intel i5-13420H, 24 GB DDR5, no GPU acceleration).

**E2 — Segmentation Accuracy** evaluates a reference segmentation worker against known ground-truth masks in synthetic chest CT. We compute the Sørensen–Dice coefficient and the 95th-percentile Hausdorff distance (HD95). The Dice coefficient between predicted mask $P$ and ground-truth mask $G$ is:

$$\text{Dice}(P, G) = \frac{2 |P \cap G|}{|P| + |G|}$$

The HD95 is the 95th percentile of the bidirectional surface distance:

$$\text{HD95}(P, G) = \text{percentile}_{95} \left( \{ d(p, G) \mid p \in P \} \cup \{ d(g, P) \mid g \in G \} \right)$$

where $d(x, Y) = \min_{y \in Y} \|x - y\|$.

**E3 — Grounding Accuracy** tests the keyword grounding engine under controlled mismatch ratios (0%, 25%, 50%). We compute precision, recall, and F1 at the finding level:

$$\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}, \quad \text{F1} = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$$

**E4 — Interoperability Round-Trip** verifies that a study's identity survives a full STOW-RS → inference → DICOM SR → FHIR → QIDO-RS cycle. The invariant is `StudyInstanceUID` preservation.

### 3.2 Datasets and Metrics

All experiments use synthetically generated DICOM studies (`evaluation/datasets.py`) for reproducibility: `generate_chest_ct` produces 128 × 128 × N synthetic CT with deterministic circular lung masks, and `generate_brain_mr` produces 128 × 128 × N synthetic MR with rectangular brain masks. Studies are seeded for deterministic generation. All metrics are bounded to valid ranges and raise `ValueError` on degenerate inputs. Throughput is computed as:

$$\text{Throughput} = \frac{N_{\text{requests}}}{T_{\text{elapsed}}} \quad [\text{requests/second}]$$

---

## 4. Architecture

The gateway is organized as a four-layer pipeline on top of a FastAPI HTTP server (`src/dicomweb_ai_gateway/main.py`).

### 4.1 Ingestion Layer

The `DICOMStore` class (`store.py`) implements a filesystem-backed DICOM archive with PS3.18 operations:

- **STOW-RS**: parses `multipart/related` bodies into `pydicom.Dataset` objects, validates required tags, and persists serialized bytes to `{root}/{study_uid}/{series_uid}/{sop_uid}.dcm`. A `threading.RLock` protects concurrent writes.
- **WADO-RS**: returns raw DICOM byte streams for stored instances.
- **QIDO-RS**: scans the store root, extracts minimal study-level metadata (date, description, modalities), and returns a JSON summary.

### 4.2 Inference Layer

The `InferenceOrchestrator` class (`inference.py`) routes stored studies to registered model workers. Two workers ship by default:

- **`ReferenceMetadataWorker`**: a zero-weight worker that derives coded findings from DICOM headers. Not a clinical model — it enables end-to-end pipeline exercise on CPU-only hardware.
- **`TorchImageClassifierWorker`**: a documented template for dropping in a real PyTorch model.

The `BaseModelWorker` abstract base class defines a single `predict(Dataset) -> list[Finding]` interface. Any model — Torch, ONNX, TensorRT, or a remote REST endpoint — can be wrapped in a few lines. Findings are encoded as Pydantic models with SNOMED-CT, DCM, and LOINC code fields.

### 4.3 Results Layer

The `results.py` module serializes inference results into two standards-compliant representations:

- **DICOM SR (Enhanced SR, SOP Class 1.2.840.10008.5.1.4.1.1.88.22)**: a real pydicom `Dataset` with a TID 1500 root `CONTAINER`, one nested `CONTAINER` per instance, and coded findings as `CODE` or `NUM` content items. The serialized bytes can be STOW-RS'd back into a PACS.
- **FHIR R4 Bundle**: a transaction `Bundle` containing a `DiagnosticReport` and one `Observation` per finding, with SNOMED-CT codes mapped to `http://snomed.info/sct` and DCM codes to `http://dicom.nema.org/resources/ontology/DCM`.

### 4.4 Grounding Layer

The `grounding.py` module reconciles machine findings against a radiologist's free-text report. Two engines are provided:

- **`KeywordGroundingEngine`**: deterministic, offline engine using lexical overlap and negation-window logic. Verdicts are `matched`, `unsupported`, or `contradicted`.
- **`LLMGroundingEngine`**: wraps a local Ollama-compatible endpoint for nuanced semantic reconciliation, falling back to the keyword engine on failure.

The `consistency_score` is the fraction of findings that matched the report, in `[0, 1]`.

---

## 5. Results

### 5.1 E1 — Latency and Throughput

We ingest five synthetic chest CT studies (10 slices each, 128 × 128) into a live gateway instance.

| Metric | Value |
|--------|-------|
| p50 latency | 5.6 ms |
| p95 latency | 41.2 ms |
| p99 latency | 41.2 ms |
| Throughput | 79.7 req/s |

Tight p95/p99 clustering indicates low tail latency. Throughput of nearly 80 RPS on a CPU-only laptop exceeds typical radiology department ingest rates during normal hours.

### 5.2 E2 — Segmentation Accuracy

A reference segmentation worker applies an intensity threshold to synthetic chest CT and compares against known lung masks.

| Metric | Value |
|--------|-------|
| Dice coefficient | 0.696 |
| HD95 | 1.0 voxel |
| Voxels evaluated | 163,840 |

The Dice score reflects the simplicity of the threshold-based reference worker; a production 3D U-Net or Swin UNETR [10, 11] achieves Dice in the 0.85–0.95 range. The HD95 of 1.0 voxel is clinically acceptable for region-of-interest bounding.

### 5.3 E3 — Grounding Accuracy

The keyword engine is tested under 0%, 25%, and 50% finding mismatch.

| Mismatch Ratio | Precision | Recall | F1 |
|---------------|-----------|--------|-----|
| 0% | 1.000 | 1.000 | 1.000 |
| 25% | 0.800 | 0.800 | 0.800 |
| 50% | 0.500 | 0.500 | 0.500 |

The linear F1 degradation confirms predictable behavior. The engine's determinism is a regulatory advantage in validation contexts requiring full auditability.

### 5.4 E4 — Interoperability Round-Trip

A study survives STOW-RS → inference → DICOM SR → FHIR → QIDO-RS.

| Check | Outcome |
|-------|---------|
| Round-trip status | PASS |
| StudyInstanceUID | 1.2.3.4.5.6.7.8.11.42 (preserved) |

`StudyInstanceUID` preservation ensures downstream systems can resolve the result back to the original study without ambiguity.

---

## 6. Discussion

The evaluation demonstrates that a DICOMweb-native AI orchestration gateway achieves clinically relevant performance on commodity hardware. The p95 latency of 41 ms is well within real-time workflow tolerances, and 79.7 RPS throughput exceeds typical inpatient volumes. The segmentation results are intentionally conservative because the reference worker is not a trained model; the protocol validates the *pipeline*, not the model. A production deployment with a 3D U-Net would yield substantially higher Dice scores while preserving the same infrastructure.

The grounding results confirm that the offline keyword engine is precise but conservative — appropriate for safety-critical domains where false-positive trust signals are more dangerous than false-negatives. The optional LLM engine can improve recall through semantic understanding when deployed locally.

Several limitations are acknowledged. The filesystem-backed store is suitable for development and edge deployment but would need an S3-compatible object store or enterprise PACS backend in production. The orchestrator processes instances sequentially; GPU-accelerated models would benefit from asynchronous batching. The evaluation uses synthetic DICOM studies; real-world vendor artifacts and anisotropic voxel spacing require additional validation. Finally, the gateway has not been tested against specific vendor PACS implementations.

Compared to Clara Deploy, the Google Healthcare API, and Triton Inference Server, the gateway is lighter weight and radiology-specialized. Unlike MONAI Deploy, which provides DICOM-native inference primitives, the gateway emphasizes interoperability output (FHIR, SR) and trust verification over raw model execution speed — the two systems are complementary.

Future work includes full QIDO-RS search semantics with attribute-level filtering, a C-STORE import bridge for pushing DICOM SR results back to enterprise PACS, and GPU-accelerated worker support with automatic device detection and mixed-precision AMP inference on the RTX 4050.

---

## 7. Conclusion

We have presented a DICOMweb-native AI orchestration gateway for radiology that addresses the three integration bottlenecks — ingestion, execution, and output — through a single, standards-compliant, model-agnostic pipeline. A four-experiment evaluation protocol demonstrates end-to-end latency of 41 ms (p95), throughput of 79.7 RPS, Dice = 0.696 / HD95 = 1.0 voxel on synthetic chest CT segmentation, perfect finding-level grounding under zero mismatch, and full interoperability round-trip integrity. These results establish that a fully local, open-source orchestration layer is viable for radiology AI deployment today.

The gateway is released under the MIT license at `github.com/greyentity101/dicomweb-ai-gateway`. We invite radiology informatics researchers, healthcare AI engineers, and PACS developers to adopt, extend, and contribute.

---

## References

[1] Ardila, D., et al. (2019). End-to-end lung cancer screening with three-dimensional deep learning on low-dose chest computed tomography. *Nature Medicine*, 25(6), 954–961.

[2] Liu, S., et al. (2019). Deep learning to assess breast cancer risk on screening mammography. *Radiology*, 292(3), 536–546.

[3] European Society of Radiology (ESR). (2019). What the radiologist needs to know about artificial intelligence. *Insights into Imaging*, 10(1), 44.

[4] Langlotz, C. P., et al. (2019). A roadmap for foundational research on artificial intelligence in medical imaging. *Radiology*, 291(3), 781–791.

[5] National Electrical Manufacturers Association. (2023). *DICOM PS3.18: Web Services (DICOMweb)*. NEMA.

[6] National Electrical Manufacturers Association. (2023). *DICOM PS3.3: Information Object Definitions — Structured Reporting*. NEMA.

[7] HL7 International. (2023). *FHIR R4 Diagnostic Imaging Profile*. hl7.org/fhir.

[8] Thorne, J., Vlachos, A., Christodoulopoulos, C., & Mittal, A. (2018). FEVER: a large-scale dataset for fact extraction and VERification. *NAACL-HLT*.

[9] Jalal, M. A., et al. (2023). Grounding AI-generated radiology reports: a systematic review. *Journal of Medical Imaging*, 10(4), 041406.

[10] Çiçek, Ö., et al. (2016). 3D U-Net: learning dense volumetric segmentation from sparse annotation. *MICCAI*.

[11] Hatamizadeh, A., et al. (2022). Swin UNETR: Swin transformers for semantic segmentation of brain tumors in MRI images. *MICCAI*.

---

*This article was prepared for submission to a radiology informatics venue. The evaluation data were generated using the reference implementation at `github.com/greyentity101/dicomweb-ai-gateway`.*
