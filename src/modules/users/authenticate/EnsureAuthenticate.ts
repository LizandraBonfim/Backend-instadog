import { NextFunction, Request, Response } from "express";
import authToken from "../../../config/authToken";
import { verify } from "jsonwebtoken";

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}


export default function ensureAuthenticate(req: Request, res: Response, next: NextFunction): void {

    const authorization = req.headers.authorization;


    if (!authorization) {
        throw new Error('Token não valido');
    }

    const [, token] = authorization.split(' ');

    const decoded: any = verify(token, authToken.jwt.secret);
    console.log('decoded::: ', decoded);
    //req.userId = decoded.sub;

    const { sub } = decoded as TokenPayload;

    req.headers = {
        id: sub
    }

    console.log('knfwhffffffffffffffffffffffffjwe', token)

    return next()

}