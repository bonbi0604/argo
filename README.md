# Argo
에이블스쿨 4기 12조 빅프로젝트 


작업 참고용 노션
https://www.notion.so/aivle4-12/56c6dc8b7c2e4c95926be643bcb3fc76?v=49325af3c6264749bedfd651543cc494

## 버전
python = 3.10
node = 20.9.0
npm = 10.1.0 
yarn = 1.22.21 


## Install Dependencies
백엔드 환경
conda create -n {env_name} python=3.10
pip install -r requirements.txt
//surprise install 오류 발생시 실행하세요
conda install -c conda-forge scikit-surprise

프론트엔드 환경  
// node, npm 버전 확인하기  
node --version
npm --version
// yarn 설치  
npm install -g yarn  
// frontend 이동  
yarn install

## db 생성
cd backend
python manage.py makemigrations
python manage.py migrate

## BE 실행 (Gunicorn)
conda activate {env_name}
python manage.py runserver // 윈도우
python gunicorn_start.py // 리눅스

## FE 실행 (React)
cd ../frontend  
yarn start