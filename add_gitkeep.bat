@echo off

echo "Adding .gitkeep files to empty folders"
for /d %%i in (data\db\*) do (
    if not exist %%i\.gitkeep (
        echo "Adding .gitkeep to %%i"
        echo "" > %%i\.gitkeep
    )
)