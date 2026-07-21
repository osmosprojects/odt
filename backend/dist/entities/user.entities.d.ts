export declare class User {
    userId: number;
    groupId: number;
    roleId: string;
    oldRoleId: string;
    loginId: string;
    userCode: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    profilePic: string;
    stream: string;
    streamCode: string;
    channel: string;
    channelCode: string;
    territoryCode: string;
    territoryName: string;
    zoneCode: string;
    zoneName: string;
    regionCode: string;
    regionName: string;
    customerType: string;
    userType: string;
    appType: string;
    status: string;
    accountStatus: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare class UserSession {
    sessionId: number;
    userId: number;
    sessionToken: string;
    ipAddress: string;
    userAgent: string;
    loginAt: Date;
    logoutAt: Date;
    isActive: string;
}
export declare class UserStreamChannelMap {
    mapId: number;
    userId: number;
    stream: string;
    channel: string;
    territoryCode: string;
    status: string;
}
export declare class UserDocument {
    docId: number;
    userId: number;
    docType: string;
    docNumber: string;
    docPath: string;
    status: string;
}
