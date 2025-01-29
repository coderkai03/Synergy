import { Team } from "./Teams";
import { User } from "./User";

export type TeamWithUserData = Team & {
  teammates: User[];
}