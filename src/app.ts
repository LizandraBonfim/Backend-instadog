import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { errors } from 'celebrate';

import routerUsers from './modules/users/Routes';
import Upload from './config/Upload';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/files', express.static(Upload.uploadFolders));
app.use(routerUsers);
app.use(errors());



app.listen(3333, () => console.log('rodando na porta 3333'));