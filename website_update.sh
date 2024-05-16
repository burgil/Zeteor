#!/bin/bash

OWNER="burgil"
REPO_NAME="Zeteor"

echo "Restarting Website..."
sleep 1
ps aux | grep "ZeteorMainWebsite" | grep -v grep | awk '{print $2}' | xargs -I{} kill -9 {}
sleep 1
echo "Fetching Updates..."
sleep 1
git fetch
echo "Pulling Updates..."
sleep 1
git pull
echo "Installing Website..."
sleep 1
npm install
sleep 1
echo "Cleaning Logs..."
sleep 1
if [ ! -d "logs" ]; then
    mkdir "logs"
fi
current_time=$(date "+%Y%m%d%H%M%S")
mv logs.txt "logs/logs_$current_time.txt"
mv logs.updater.txt "logs/logs_updater_$current_time.txt"
sleep 1
echo "Starting Website..."
nohup npm start > logs.txt 2>&1 &
echo "Website Restarted!"
sleep 1

get_latest_commit() {
    curl -s "https://api.github.com/repos/$OWNER/$REPO_NAME/commits/main" | grep '"sha"' | head -n 1 | cut -d '"' -f 4
}
LAST_COMMIT=$(get_latest_commit)
while true; do
    LATEST_COMMIT=$(get_latest_commit)
    echo "LATEST COMMIT: $LATEST_COMMIT"
    if [ "$LATEST_COMMIT" != "$LAST_COMMIT" ]; then
        if [ "$LATEST_COMMIT" != "" ]; then
            echo "Changes detected in the repository!"
            LAST_COMMIT=$LATEST_COMMIT
            echo "Restarting Website..."
            sleep 1
            ps aux | grep "ZeteorMainWebsite" | grep -v grep | awk '{print $2}' | xargs -I{} kill -9 {}
            sleep 1
            echo "Fetching Updates..."
            sleep 1
            git fetch
            echo "Pulling Updates..."
            sleep 1
            git pull
            echo "Installing Website..."
            sleep 1
            npm install
            sleep 1
            echo "Cleaning Logs..."
            sleep 1
            if [ ! -d "logs" ]; then
                mkdir "logs"
            fi
            current_time=$(date "+%Y%m%d%H%M%S")
            mv logs.txt "logs/logs_$current_time.txt"
            mv logs.updater.txt "logs/logs_updater_$current_time.txt"
            sleep 1
            echo "Starting Website..."
            nohup npm start > logs.txt 2>&1 &
            echo "Website Restarted!"
        fi
    fi
    sleep 140
done