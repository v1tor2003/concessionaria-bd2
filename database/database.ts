// @ts-nocheck
import mysql from "mysql2/promise";

const dbCredentials: mysql.ConnectionOptions = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  database: process.env.MYSQL_DATABASE,
}

let database: mysql.Connection

async function connect(credentials: mysql.ConnectionOptions): Promise<mysql.Connection> {
  return await mysql.createConnection({
    host: credentials.host,
    user: credentials.user,
    database: credentials.database
  })
}

async function main(): Promise<void>{
  if(process.env.NODE_ENV === "production"){
    database = await connect(dbCredentials)
  }
  else {
    if(!global.database) global.database = await connect(dbCredentials)
    database = global.database
  }
}


main()
  .then(() => {console.log('Database connected')})
  .catch((e: unknown) => {
    console.log(e)
    process.exit(1)
  })



export default database