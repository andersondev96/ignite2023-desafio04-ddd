import { Recipient } from "../entities/Recipient";

export interface RecipientRepository {
    create(recipient: Recipient): Promise<void>
}