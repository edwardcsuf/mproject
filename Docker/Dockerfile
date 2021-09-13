FROM mcr.microsoft.com/windows/nanoserver:1809
WORKDIR C:/node

RUN curl.exe -o node.zip https://nodejs.org/dist/v10.15.3/node-v10.15.3-win-x64.zip && \
  tar.exe -xf node.zip -C "C:/Node" --strip-components=1 && \
  del node.zip

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 8080

CMD npm start