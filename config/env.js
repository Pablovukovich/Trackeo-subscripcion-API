import {config} from 'dotenv'

config({path:`.env.${process.env.NOD_ENV || 'development'}.local`})

export const { PORT, NODE_ENV } = process.env