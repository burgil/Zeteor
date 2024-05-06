ps aux | grep "ZeteorMainWebsite" | grep -v grep | awk '{print $2}' | xargs -I{} kill -9 {}
cd ..
git fetch
git pull
cd website
nohup npm start &