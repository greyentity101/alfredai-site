# ============================================================
# Launch the researcher site in Brave.
#   pwsh -ExecutionPolicy Bypass -File launch-brave.ps1
#   pwsh ... launch-brave.ps1 -Edit   # open with placeholder outlines
# Falls back to the default browser if Brave is not found.
# ============================================================
param([switch]$Edit)

$site = Split-Path -Parent $MyInvocation.MyCommand.Path
$url  = 'file:///' + ((Join-Path $site 'index.html') -replace '\\', '/')
if ($Edit) { $url += '?edit=1' }

$candidates = @(
  "$env:ProgramFiles\BraveSoftware\Brave-Browser\Application\brave.exe",
  "${env:ProgramFiles(x86)}\BraveSoftware\Brave-Browser\Application\brave.exe",
  "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\Application\brave.exe"
)
$brave = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $brave) { $brave = (Get-Command brave -ErrorAction SilentlyContinue).Source }

if ($brave) {
  Start-Process $brave -ArgumentList $url
  "Opened in Brave: $url"
} else {
  Start-Process $url
  "Brave not found — opened in default browser: $url"
}
