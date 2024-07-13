export interface Users {
    id: number;
    name: string;
    lastName: string;
    email: string;
    profile: Profile
};

export interface Profile {
    profile: string;
};

export interface UserBody {
    name: string;
    lastName: string;
    email: string;
    passwd: string;
    profile: number;
};

export interface ServiceResponse {
    Message: string;
    User: Users
};

export interface UserHash {
    passwd: string
};

export interface UserLogin {
    email: string,
    passwd: string
}
