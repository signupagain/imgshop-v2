export interface UserData {
	username: string
	name?: string
	ownList?: ImgIdType[]
}

export interface FullUserData extends Required<UserData> {
	password: string
	refresh: string
}

export interface ClientUserData extends UserData {
	imgMap?: Map<ImgIdType, ImgType>
}

export interface SerializableUserData extends UserData {
	imgMap?: Record<ImgIdType, ImgType>
}

export type UserCheckType = { account: string }

export type UserTokenType = {
	accessJWT: string
	refreshExp: number
}
