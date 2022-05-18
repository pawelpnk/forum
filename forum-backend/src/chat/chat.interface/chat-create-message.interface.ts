import { Group } from "../../entity/group.entity";

export class ChatCreateMessage {
    text: string;
    group: Group;
    userLogin: string;
}