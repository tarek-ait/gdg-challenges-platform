FROM node:18-slim

WORKDIR /app

COPY package*.json ./

# Remove any existing node_modules and package-lock.json (clean install)
RUN rm -rf node_modules package-lock.json 

RUN npm install

COPY . .

EXPOSE 5173


CMD ["npm", "run", "dev", "--", "--host"]