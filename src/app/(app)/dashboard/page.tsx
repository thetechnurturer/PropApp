import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Building2, Users, FileText, Wrench, Home } from "lucide-react";

async function getStats() {
  const [properties, units, tenants, activeLeases, openWorkOrders] =
    await Promise.all([
      prisma.property.count(),
      prisma.unit.count(),
      prisma.tenant.count({ where: { status: "active" } }),
      prisma.lease.count({ where: { status: "active" } }),
      prisma.workOrder.count({ where: { status: { not: "completed" } } }),
    ]);

  const occupiedUnits = await prisma.unit.count({ where: { status: "occupied" } });
  const vacantUnits = await prisma.unit.count({ where: { status: "vacant" } });

  return { properties, units, tenants, activeLeases, openWorkOrders, occupiedUnits, vacantUnits };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getStats();

  const cards = [
    {
      label: "Total Properties",
      value: stats.properties,
      icon: Building2,
      color: "#c9622f",
    },
    {
      label: "Total Units",
      value: stats.units,
      icon: Home,
      color: "#2563eb",
    },
    {
      label: "Active Tenants",
      value: stats.tenants,
      icon: Users,
      color: "#16a34a",
    },
    {
      label: "Active Leases",
      value: stats.activeLeases,
      icon: FileText,
      color: "#9333ea",
    },
    {
      label: "Open Work Orders",
      value: stats.openWorkOrders,
      icon: Wrench,
      color: "#d97706",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">
          Good morning, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here&apos;s what&apos;s happening with your properties today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 mb-8" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl p-5"
            style={{ border: "1px solid #e4dfd2" }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{label}</p>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: color + "15" }}
              >
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Occupancy summary */}
      <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div
          className="bg-white rounded-2xl p-6"
          style={{ border: "1px solid #e4dfd2" }}
        >
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Unit Occupancy
          </h2>
          {stats.units === 0 ? (
            <p className="text-sm text-gray-400">No units yet. Add a property to get started.</p>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#16a34a" }} />
                  <span className="text-sm text-gray-600">Occupied</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {stats.occupiedUnits}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: "#e4dfd2" }} />
                  <span className="text-sm text-gray-600">Vacant</span>
                </div>
                <span className="text-sm font-semibold text-gray-800">
                  {stats.vacantUnits}
                </span>
              </div>
              {/* Bar */}
              <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: "#f4f1ea" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    background: "#16a34a",
                    width: stats.units > 0
                      ? `${(stats.occupiedUnits / stats.units) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <p className="text-xs text-gray-400">
                {stats.units > 0
                  ? `${Math.round((stats.occupiedUnits / stats.units) * 100)}% occupancy rate`
                  : "0% occupancy rate"}
              </p>
            </div>
          )}
        </div>

        <div
          className="bg-white rounded-2xl p-6"
          style={{ border: "1px solid #e4dfd2" }}
        >
          <h2 className="text-base font-semibold text-gray-800 mb-4">
            Getting Started
          </h2>
          <div className="flex flex-col gap-3">
            {[
              { label: "Add your first property", done: stats.properties > 0, href: "/properties" },
              { label: "Add a tenant", done: stats.tenants > 0, href: "/tenants" },
              { label: "Create a lease", done: stats.activeLeases > 0, href: "/leases" },
            ].map(({ label, done, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-3 text-sm"
                style={{ color: done ? "#6b7280" : "#c9622f" }}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: done ? "#16a34a" : "#c9622f" }}
                >
                  {done && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={done ? "line-through text-gray-400" : ""}>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
