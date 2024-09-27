import { startSpan } from "@sentry/nextjs";
import { injectable } from "inversify";
import { IParentsRepository } from "~/application/repositories/parents.repository.interface";
import { Parent, ParentInsert, ParentUpdate } from "~/domain/entities/parent";
import {
  ParentNotFoundError,
  ParentStillReferencedError,
  ParentWithThatEmailAddressAlreadyExistsError,
} from "~/domain/errors/parents";
import { AddressNotFoundError } from "~/domain/errors/addresses";
import { mockData } from "~/infrastructure/mock-data";

@injectable()
export class MockParentsRepository implements IParentsRepository {
  private parents: Parent[] = mockData.parents;
  private autoIncrementId: number =
    this.parents.reduce((maxId, parent) => {
      return parent.id > maxId ? parent.id : maxId;
    }, 0) + 1;

  private isParentReferenced(parentId: number): boolean {
    const memberParentWithParentExists = mockData.parentMembers.some(
      (mp) => mp.parentId === parentId,
    );

    return memberParentWithParentExists;
  }

  async createParent(parent: ParentInsert): Promise<Parent> {
    return startSpan({ name: "MockParentsRepository > createParent" }, () => {
      const address = mockData.addresses.find((a) => a.id === parent.addressId);
      if (!address) {
        throw new AddressNotFoundError("Address not found");
      }

      const existingParent = this.parents.find(
        (p) =>
          p.emailAddress.toLowerCase() === parent.emailAddress.toLowerCase(),
      );
      if (existingParent) {
        throw new ParentWithThatEmailAddressAlreadyExistsError(
          "A parent with that email address already exists",
        );
      }

      const newParent: Parent = {
        id: this.autoIncrementId++,
        ...parent,
        name: {
          firstName: parent.name.firstName,
          lastName: parent.name.lastName,
        },
      };

      this.parents.push(newParent);
      return newParent;
    });
  }

  async getParentById(id: number): Promise<Parent | undefined> {
    return startSpan({ name: "MockParentsRepository > getParentById" }, () => {
      return this.parents.find((p) => p.id === id);
    });
  }

  async getParentByEmailAddress(
    emailAddress: string,
  ): Promise<Parent | undefined> {
    return startSpan(
      { name: "MockParentsRepository > getParentByEmailAddress" },
      () => {
        return this.parents.find(
          (p) => p.emailAddress.toLowerCase() === emailAddress.toLowerCase(),
        );
      },
    );
  }

  async getAllParents(): Promise<Parent[]> {
    return startSpan({ name: "MockParentsRepository > getAllParents" }, () => {
      return this.parents;
    });
  }

  async getParentsForMember(memberId: number): Promise<
    {
      parent: Parent;
      isPrimary: boolean;
    }[]
  > {
    return startSpan(
      { name: "MockParentsRepository > getParentsForMember" },
      () => {
        const parentMemberRelationships = mockData.parentMembers.filter(
          (mp) => mp.memberId === memberId,
        );

        const parentIds = parentMemberRelationships.map((mp) => mp.parentId);

        const parents = this.parents.filter((p) => parentIds.includes(p.id));

        return parentMemberRelationships.map((mp) => {
          const parent = parents.find((p) => p.id === mp.parentId);
          if (!parent) {
            throw new ParentNotFoundError("Parent not found");
          }
          return {
            parent,
            isPrimary: mp.isPrimary,
          };
        });
      },
    );
  }

  async updateParent(id: number, parent: ParentUpdate): Promise<Parent> {
    return startSpan({ name: "MockParentsRepository > updateParent" }, () => {
      const parentIndex = this.parents.findIndex((p) => p.id === id);
      if (parentIndex === -1) {
        throw new ParentNotFoundError("Parent not found");
      }

      if (parent.addressId) {
        const addressExists = mockData.addresses.some(
          (a) => a.id === parent.addressId,
        );
        if (!addressExists) {
          throw new AddressNotFoundError("Address not found");
        }
      }

      const existingParentWithEmailAddress = this.parents.find(
        (p) =>
          p.emailAddress.toLowerCase() === parent.emailAddress?.toLowerCase() &&
          p.id !== id,
      );
      if (existingParentWithEmailAddress) {
        throw new ParentWithThatEmailAddressAlreadyExistsError(
          "A parent with that email address already exists",
        );
      }

      this.parents[parentIndex] = {
        ...this.parents[parentIndex]!,
        ...parent,
        name: {
          firstName:
            parent.name?.firstName ?? this.parents[parentIndex]!.name.firstName,
          lastName:
            parent.name?.lastName ?? this.parents[parentIndex]!.name.lastName,
        },
      };
      return this.parents[parentIndex];
    });
  }

  async deleteParent(id: number): Promise<void> {
    return startSpan({ name: "MockParentsRepository > deleteParent" }, () => {
      if (this.isParentReferenced(id)) {
        throw new ParentStillReferencedError("Parent still referenced");
      }

      const parentIndex = this.parents.findIndex((p) => p.id === id);
      if (parentIndex === -1) {
        throw new ParentNotFoundError("Parent not found");
      }
      this.parents.splice(parentIndex, 1);
    });
  }

  async deleteAllParents(): Promise<void> {
    return startSpan(
      { name: "MockParentsRepository > deleteAllParents" },
      () => {
        if (this.parents.some((parent) => this.isParentReferenced(parent.id))) {
          throw new ParentStillReferencedError("Parent still referenced");
        }

        this.parents = [];
      },
    );
  }
}
