export interface WeatherObservation {temperature:number;wind:number;description:string;time:string;source:string}
export interface ContributionDay {date:string;count:number;level:number}
export interface ContributionsPayload {username:string;profileUrl:string;range:{from:string;to:string};contributions:ContributionDay[];updatedAt:string}
