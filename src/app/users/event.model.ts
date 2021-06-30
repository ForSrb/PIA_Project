export interface Event{
    _id: string,
    creator: string,
    name: string,
    beginDate: Date,
    endDate: Date,
    description: string,
    isPrivate: boolean,
    isActive: boolean,
    participants: string
}