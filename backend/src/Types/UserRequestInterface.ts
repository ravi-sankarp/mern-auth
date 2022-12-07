import { Request } from 'express';
import userType from './UserInterface';
interface userInfoReq extends Request {
  userDetails?: userType;
}

export default userInfoReq;
