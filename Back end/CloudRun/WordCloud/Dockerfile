FROM ubuntu:18.04

RUN apt-get update -y && \
    apt-get install -y python3-pip python-dev python3-cffi libcairo2 libpango-1.0-0 libpangocairo-1.0-0 libgdk-pixbuf2.0-0 libffi-dev shared-mime-info

ENV APP_HOME /app
COPY ./requirements.txt $APP_HOME/requirements.txt
WORKDIR $APP_HOME
RUN pip3 --no-cache-dir install -r requirements.txt
COPY . $APP_HOME
CMD [ "python3", "app.py" ]
