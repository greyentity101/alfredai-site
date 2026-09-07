# Launch the researcher site in Brave or default browser
param([switch]$Edit)

$site = Split-Path -Parent $MyInvocation.MyCommand.Path
$url  = "file:///" + ((Join-Path $site "index.html") -replace "\\", "/")
if ($Edit) { $url += "?edit=1" }

$candidates = @(
  "$env:ProgramFiles\BraveSoftware\Brave-Browser\Application\brave.exe",
  "${env:ProgramFiles(x86)}\BraveSoftware\Brave-Browser\Application\brave.exe",
  "$env:LOCALAPPDATA\BraveSoftware\Brave-Browser\Application\brave.exe"
)
$brave = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $brave) { $brave = (Get-Command brave -ErrorAction SilentlyContinue).Source }

if ($brave) {
  Start-Process $brave -ArgumentList $url
  Write-Output "Opened in Brave: $url"
} else {
  Start-Process $url
  Write-Output "Opened in default browser: $url"
}
