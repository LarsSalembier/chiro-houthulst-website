"use client";

import { useState, useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Utensils, Download, Printer, Shuffle, BarChart3 } from "lucide-react";
import type { Group, WorkYear } from "~/server/db/schema";

interface Member {
  id: number;
  member: {
    id: number;
    firstName: string;
    lastName: string;
    gender: "M" | "F" | "X";
  };
  group: Group;
  groupId: number;
  campPaymentReceived: boolean;
}

interface TableDistributionProps {
  members: Member[];
  groups: Group[];
  workYear: WorkYear;
}

interface Table {
  id: number;
  members: Member[];
  groupDistribution: Record<number, number>;
}

export default function TableDistribution({
  members,
  groups,
}: TableDistributionProps) {
  const [tables, setTables] = useState<Table[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate table distribution
  const generateTableDistribution = () => {
    setIsGenerating(true);

    // Simulate processing time
    setTimeout(() => {
      const totalMembers = members.length;
      const numTables = Math.ceil(totalMembers / 9);

      // Sort groups from oldest to youngest (by minimum age)
      const sortedGroups = [...groups].sort(
        (a, b) => b.minimumAgeInDays - a.minimumAgeInDays,
      );

      // Create empty tables
      const newTables: Table[] = Array.from({ length: numTables }, (_, i) => ({
        id: i + 1,
        members: [],
        groupDistribution: {},
      }));

      // Group members by their group and shuffle each group
      const membersByGroup: Record<number, Member[]> = {};
      sortedGroups.forEach((group) => {
        const groupMembers = members.filter((m) => m.groupId === group.id);
        if (groupMembers.length > 0) {
          // Shuffle the members within each group
          const shuffledMembers = [...groupMembers].sort(
            () => Math.random() - 0.5,
          );
          membersByGroup[group.id] = shuffledMembers;
        }
      });

      // Round-robin distribution: start with oldest group (Aspis)
      let currentTableIndex = 0;

      // Process each group from oldest to youngest
      for (const groupId of Object.keys(membersByGroup).map(Number)) {
        const groupMembers = membersByGroup[groupId];
        if (!groupMembers) continue;

        // Distribute all members of this group in round-robin fashion
        for (const member of groupMembers) {
          // Find the next table with space
          let attempts = 0;
          while (attempts < numTables) {
            const currentTable = newTables[currentTableIndex];
            if (currentTable && currentTable.members.length < 9) {
              break;
            }
            currentTableIndex = (currentTableIndex + 1) % numTables;
            attempts++;
          }

          // Add member to current table
          const table = newTables[currentTableIndex];
          if (table) {
            table.members.push(member);
            table.groupDistribution[groupId] =
              (table.groupDistribution[groupId] ?? 0) + 1;

            // Move to next table
            currentTableIndex = (currentTableIndex + 1) % numTables;
          }
        }
      }

      setTables(newTables);
      setIsGenerating(false);
    }, 500);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (tables.length === 0) return null;

    const totalMembers = tables.reduce(
      (sum, table) => sum + table.members.length,
      0,
    );
    const avgTableSize = totalMembers / tables.length;
    const tablesWith8 = tables.filter((t) => t.members.length === 8).length;
    const tablesWith9 = tables.filter((t) => t.members.length === 9).length;
    const tablesWith7 = tables.filter((t) => t.members.length === 7).length;

    return {
      totalMembers,
      avgTableSize: Math.round(avgTableSize * 10) / 10,
      tablesWith8,
      tablesWith9,
      tablesWith7,
    };
  }, [tables]);

  // Export to PDF (placeholder)
  const exportToPDF = () => {
    // TODO: Implement PDF export
    alert("PDF export functionaliteit wordt binnenkort toegevoegd!");
  };

  // Print (placeholder)
  const printTables = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader className="px-6 py-3">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Utensils className="h-5 w-5" />
            Tafelverdeling
          </h2>
        </CardHeader>
        <CardBody className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button
              color="primary"
              onPress={generateTableDistribution}
              isLoading={isGenerating}
              startContent={<Shuffle className="h-4 w-4" />}
            >
              {tables.length > 0 ? "Nieuwe verdeling" : "Genereer verdeling"}
            </Button>

            {tables.length > 0 && (
              <>
                <Button
                  variant="bordered"
                  onPress={exportToPDF}
                  startContent={<Download className="h-4 w-4" />}
                >
                  Exporteer PDF
                </Button>
                <Button
                  variant="bordered"
                  onPress={printTables}
                  startContent={<Printer className="h-4 w-4" />}
                >
                  Print
                </Button>
              </>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Statistics */}
      {stats && (
        <Card>
          <CardHeader className="px-6 py-3">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <BarChart3 className="h-5 w-5" />
              Statistieken
            </h3>
          </CardHeader>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div className="text-center">
                <p className="text-sm text-gray-600">Totaal leden</p>
                <p className="text-2xl font-bold">{stats.totalMembers}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Gemiddelde tafelgrootte</p>
                <p className="text-2xl font-bold">{stats.avgTableSize}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Tafels met 8 leden</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.tablesWith8}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Tafels met 9 leden</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.tablesWith9}
                </p>
              </div>
              {stats.tablesWith7 > 0 && (
                <div className="text-center">
                  <p className="text-sm text-gray-600">Tafels met 7 leden</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.tablesWith7}
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Tables */}
      {tables.length > 0 && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {tables.map((table) => (
            <Card key={table.id} className="print:break-inside-avoid">
              <CardHeader className="px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-100 p-2">
                      <Utensils className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold">Tafel {table.id}</h3>
                  </div>
                  <Chip
                    color={table.members.length >= 8 ? "success" : "danger"}
                    variant="flat"
                    className="ml-4"
                  >
                    {table.members.length} leden
                  </Chip>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                {/* Group distribution */}
                <div className="mb-4">
                  <h4 className="mb-2 text-sm font-medium text-gray-700">
                    Verdeling per groep:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(table.groupDistribution)
                      .sort(([groupIdA], [groupIdB]) => {
                        const groupA = groups.find(
                          (g) => g.id === parseInt(groupIdA),
                        );
                        const groupB = groups.find(
                          (g) => g.id === parseInt(groupIdB),
                        );
                        return (
                          (groupB?.minimumAgeInDays ?? 0) -
                          (groupA?.minimumAgeInDays ?? 0)
                        );
                      })
                      .map(([groupId, count]) => {
                        const group = groups.find(
                          (g) => g.id === parseInt(groupId),
                        );
                        return (
                          <Chip
                            key={groupId}
                            variant="flat"
                            style={{
                              backgroundColor: group?.color
                                ? `${group.color}20`
                                : undefined,
                              color: group?.color ?? undefined,
                            }}
                          >
                            {group?.name}: {count}
                          </Chip>
                        );
                      })}
                  </div>
                </div>

                <Divider className="my-4" />

                {/* Members list */}
                <div>
                  <h4 className="mb-3 text-sm font-medium text-gray-700">
                    Leden:
                  </h4>
                  <div className="space-y-2">
                    {table.members
                      .sort((a, b) => {
                        // First sort by group age (oldest to youngest)
                        const groupAgeDiff =
                          (b.group.minimumAgeInDays ?? 0) -
                          (a.group.minimumAgeInDays ?? 0);
                        if (groupAgeDiff !== 0) return groupAgeDiff;

                        // Then sort by name within the same group
                        const lastNameDiff = a.member.lastName.localeCompare(
                          b.member.lastName,
                        );
                        if (lastNameDiff !== 0) return lastNameDiff;

                        return a.member.firstName.localeCompare(
                          b.member.firstName,
                        );
                      })
                      .map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between rounded-lg border p-3"
                          style={{
                            borderColor: member.group.color
                              ? `${member.group.color}40`
                              : "#e5e7eb",
                            backgroundColor: member.group.color
                              ? `${member.group.color}10`
                              : "#f9fafb",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor:
                                  member.group.color ?? "#6b7280",
                              }}
                            />
                            <span className="font-medium">
                              {member.member.firstName} {member.member.lastName}
                            </span>
                          </div>
                          <Chip
                            size="sm"
                            variant="flat"
                            style={{
                              backgroundColor: member.group.color
                                ? `${member.group.color}20`
                                : undefined,
                              color: member.group.color ?? undefined,
                            }}
                          >
                            {member.group.name}
                          </Chip>
                        </div>
                      ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {tables.length === 0 && !isGenerating && (
        <Card>
          <CardBody className="p-12 text-center">
            <Utensils className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              Nog geen tafelverdeling
            </h3>
            <p className="text-gray-600">
              Klik op &quot;Genereer verdeling&quot; om automatisch leden over
              tafels te verdelen.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
