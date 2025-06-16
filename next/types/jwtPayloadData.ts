export interface JwtPayloadData {
    subject: string;
    issueTime: number; 
    expirationTime: number;
}