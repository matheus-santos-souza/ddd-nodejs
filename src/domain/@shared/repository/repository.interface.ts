import { UUID } from "node:crypto";

export default interface RepositoryInterface<T> {
    create(entity: T): Promise<void>;
    update(entity: T): Promise<void>;
    find(id: UUID): Promise<T>;
    findAll(): Promise<T[]>;
}