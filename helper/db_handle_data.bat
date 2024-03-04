@echo off
setlocal enabledelayedexpansion

:: HANDLE DATA FOR POSTGRES
echo [POSTGRES]: Handling data...
timeout /t 2 > nul

:: SET SOME VARIABLES
:: arg1 is the first argument passed to this script - Ex: save or restore
set arg1=%1
set arg2=%2

:: dest_dir is the directory where the data will be saved
:: it need to be in the double quotes in order to handle spaces in the path - Ex: "C:\Users\My User\Documents\my project\backend\db"
set "dest_dir=..\backend\db"

:: database settings
set "container_name=postgres"
set "user=postgres"
set "dbname=postgres"

:: CHECK IF THE CONTAINER IS RUNNING
for /f "tokens=*" %%a in ('docker inspect -f "{{.State.Status}}" %container_name% 2^>nul') do (
    set "container_status=%%a"
)

if "%container_status%" == "running" (
    echo [POSTGRES]: Container "%container_name%" is running.
    timeout /t 2 > nul

    :: SAVE OR RESTORE DATA
    if "%arg1%" == "save" (
        echo [POSTGRES]: Saving data...

        :: Check if the directory exists
        if not exist %dest_dir% (
            echo [POSTGRES]: Creating directory "%dest_dir%"...
            mkdir %dest_dir%
            timeout /t 2 > nul
        )
        
        :: Save data to backup directory - Ex: ../backend/db/backups/YYYYMMDD_HHMMSS.sql
        :: if backups directory does not exist, it will be created automatically
        if not exist %dest_dir%\backups\ (
            echo [POSTGRES]: Creating directory "%dest_dir%\backups\"...
            mkdir %dest_dir%\backups\
            timeout /t 2 > nul
        )

        :: Save backup data
        set hour=%time: =0%

        docker exec -it %container_name% pg_dump -U %user% -d %dbname% > "%dest_dir%\backups\%date:~10,4%%date:~4,2%%date:~7,2%_!hour:~0,2!%time:~3,2%%time:~6,2%.sql" && (
            echo [POSTGRES]: Data saved to "%dest_dir%\backups\%date:~10,4%-%date:~4,2%-%date:~7,2%_!hour:~0,2!-%time:~3,2%-%time:~6,2%.sql"
        ) || (
            echo [ERROR]: Could not save data to "%dest_dir%\backups\%date:~10,4%-%date:~4,2%-%date:~7,2%_!hour:~0,2!-%time:~3,2%-%time:~6,2%.sql" due to some errors.
        )

        :: Save data
        docker exec -it %container_name% pg_dump -U %user% -d %dbname% > %dest_dir%\data.sql && (
            echo [POSTGRES]: Lastes data saved to "%dest_dir%\data.sql"
        ) || (
            echo [ERROR]: Could not save lastest data to due to some errors.
        )
    ) else if "%arg1%" == "restore" (
        echo [POSTGRES]: Loading data...

        :: Check if arg2 is empty or not
        if "%arg2%" == "" (
            echo [POSTGRES]: No file specified. Using "%dest_dir%\data.sql" as default.
            :: Using !dest_dir! instead of %dest_dir% to handle global variable
            set "dir_filename=!dest_dir!\data.sql"
        ) else (
            echo [POSTGRES]: Using "%arg2%" as data file.
            :: Using !arg2! instead of %arg2% to handle global variable
            set "dir_filename=!arg2!"
        )

        echo [POSTGRES]: Loading data from !dir_filename!
        docker cp !dir_filename! %container_name%:docker-entrypoint-initdb.d/
        :: sleep 2 seconds to make sure the file is copied to the container
        timeout /t 2 > nul

        :: Clean all content in the database
        docker exec -it %container_name% psql -U %user% -d %dbname% -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" && (
            echo [POSTGRES]: Database cleaned.
        ) || (
            echo [ERROR]: Could not clean database due to some errors.
        )

        :: Get the filename from the path
        for %%F in (!dir_filename!) do set "filename=%%~nxF"
        echo [POSTGRES]: Loading data inside container from docker-entrypoint-initdb.d/!filename!...

        :: Load the latest data
        docker exec -it %container_name% psql -U %user% -d %dbname% -f docker-entrypoint-initdb.d/!filename! && (
            echo [POSTGRES]: Data loaded from docker-entrypoint-initdb.d/!filename!
        ) || (
            echo [ERROR]: Could not load data due to some errors.
        )
    ) else (
        echo [ERROR]: Invalid argument. Use 'save' or 'restore'.
    )
) else (
    echo [POSTGRES]: Container "%container_name%" is not running.
    echo [POSTGRES]: You must start container "%container_name%" first... ^(manually at that time^)
)