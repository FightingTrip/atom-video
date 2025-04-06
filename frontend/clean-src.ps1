# PowerShell script to clean compiled files in src directory

# Get current script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$srcDir = Join-Path $scriptDir "src"

Write-Host "Cleaning compiled files in src directory..."

# Delete JavaScript files (preserve package.json and other config files)
Get-ChildItem -Path $srcDir -Recurse -Include "*.js" -Exclude "*.config.js" | 
Where-Object { $_.Directory.Name -ne "node_modules" } | 
ForEach-Object { 
  Write-Host "Deleting file: $($_.FullName)"
  Remove-Item $_.FullName 
}

# Delete sourcemap files
Get-ChildItem -Path $srcDir -Recurse -Include "*.js.map" | 
Where-Object { $_.Directory.Name -ne "node_modules" } | 
ForEach-Object { 
  Write-Host "Deleting file: $($_.FullName)"
  Remove-Item $_.FullName 
}

# Delete Vue TypeScript declaration files
Get-ChildItem -Path $srcDir -Recurse -Include "*.vue.d.ts" | 
Where-Object { $_.Directory.Name -ne "node_modules" } | 
ForEach-Object { 
  Write-Host "Deleting file: $($_.FullName)"
  Remove-Item $_.FullName 
}

# Delete TypeScript declaration files (exclude env.d.ts and files in types directory)
Get-ChildItem -Path $srcDir -Recurse -Include "*.d.ts" | 
Where-Object { 
  $_.Name -ne "env.d.ts" -and 
  -not ($_.FullName -like "*\types\*") -and 
  $_.Directory.Name -ne "node_modules" 
} | 
ForEach-Object { 
  Write-Host "Deleting file: $($_.FullName)"
  Remove-Item $_.FullName 
}

Write-Host "Cleaning completed!" 