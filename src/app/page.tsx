"use client";

import { useMemo, useState } from "react";

type Job = {
  id: string;
  title: string;
  client: string;
  amount: number;
  invoiced: boolean;
  started: boolean;
  completed: boolean;
  paid: boolean;
  createdAt: string;
};

type SortKey = "title" | "client" | "amount" | "createdAt";

type Filters = {
  showInvoiced: boolean | null;
  showPaid: boolean | null;
  showCompleted: boolean | null;
};

const starterJobs: Job[] = [
  {
    id: "1",
    title: "Logo refresh",
    client: "Northwind Co",
    amount: 1200,
    invoiced: true,
    started: true,
    completed: false,
    paid: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Instagram content pack",
    client: "Brightline Church",
    amount: 650,
    invoiced: false,
    started: false,
    completed: false,
    paid: false,
    createdAt: new Date().toISOString(),
  },
];

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>(starterJobs);
  const [form, setForm] = useState({ title: "", client: "", amount: "" });
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    showInvoiced: null,
    showPaid: null,
    showCompleted: null,
  });

  const totalRevenue = useMemo(
    () => jobs.reduce((sum, job) => sum + (job.paid ? job.amount : 0), 0),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filters.showInvoiced !== null && job.invoiced !== filters.showInvoiced) {
        return false;
      }
      if (filters.showPaid !== null && job.paid !== filters.showPaid) {
        return false;
      }
      if (filters.showCompleted !== null && job.completed !== filters.showCompleted) {
        return false;
      }
      return true;
    });
  }, [jobs, filters]);

  const sortedJobs = useMemo(() => {
    const copy = [...filteredJobs];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") {
        return sortAsc ? av - bv : bv - av;
      }
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return copy;
  }, [filteredJobs, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
      return;
    }
    setSortKey(key);
    setSortAsc(true);
  }

  function addJob() {
    if (!form.title.trim() || !form.client.trim() || !form.amount.trim()) {
      alert("Add title, client, and amount.");
      return;
    }

    const newJob: Job = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      client: form.client.trim(),
      amount: Number(form.amount),
      invoiced: false,
      started: false,
      completed: false,
      paid: false,
      createdAt: new Date().toISOString(),
    };

    setJobs((prev) => [newJob, ...prev]);
    setForm({ title: "", client: "", amount: "" });
  }

  function toggleJob(id: string, key: keyof Job) {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, [key]: !job[key] } : job))
    );
  }

  function exportCsv() {
    const headers = [
      "Title",
      "Client",
      "Amount",
      "Invoiced",
      "Started",
      "Completed",
      "Paid",
      "Created",
    ];
    const rows = jobs.map((job) => [
      job.title,
      job.client,
      job.amount,
      job.invoiced ? "Yes" : "No",
      job.started ? "Yes" : "No",
      job.completed ? "Yes" : "No",
      job.paid ? "Yes" : "No",
      job.createdAt,
    ]);
    const csv = [headers, ...rows]
      .map((line) =>
        line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "side-hustle-jobs.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    window.print();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">Side Hustle</h1>
              <p className="text-sm text-slate-400">
                Track invoices, job status, and paid totals in one place.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2">
              <p className="text-xs uppercase text-slate-500">Paid total</p>
              <p className="text-xl font-semibold">R {totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase text-slate-500">Jobs</p>
            <p className="text-2xl font-semibold">{jobs.length}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase text-slate-500">Invoiced</p>
            <p className="text-2xl font-semibold">
              {jobs.filter((job) => job.invoiced).length}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase text-slate-500">Paid</p>
            <p className="text-2xl font-semibold">
              {jobs.filter((job) => job.paid).length}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <h2 className="text-lg font-semibold">Add a job</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-slate-500 outline-none"
              placeholder="Job title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <input
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-slate-500 outline-none"
              placeholder="Client"
              value={form.client}
              onChange={(event) => setForm((prev) => ({ ...prev, client: event.target.value }))}
            />
            <input
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm focus:border-slate-500 outline-none"
              placeholder="Amount"
              type="number"
              value={form.amount}
              onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={addJob}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
            >
              Add Job
            </button>
            <button
              onClick={exportCsv}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm"
            >
              Export CSV
            </button>
            <button
              onClick={exportPdf}
              className="rounded-xl border border-slate-700 px-4 py-2 text-sm"
            >
              Export PDF
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Jobs</h2>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                className={`rounded-full border px-3 py-1 ${
                  filters.showInvoiced === null
                    ? "border-emerald-500 text-emerald-300"
                    : "border-slate-700 text-slate-400"
                }`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    showInvoiced: prev.showInvoiced === null ? true : null,
                  }))
                }
              >
                Invoiced
              </button>
              <button
                className={`rounded-full border px-3 py-1 ${
                  filters.showCompleted === null
                    ? "border-emerald-500 text-emerald-300"
                    : "border-slate-700 text-slate-400"
                }`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    showCompleted: prev.showCompleted === null ? true : null,
                  }))
                }
              >
                Completed
              </button>
              <button
                className={`rounded-full border px-3 py-1 ${
                  filters.showPaid === null
                    ? "border-emerald-500 text-emerald-300"
                    : "border-slate-700 text-slate-400"
                }`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    showPaid: prev.showPaid === null ? true : null,
                  }))
                }
              >
                Paid
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-left text-xs uppercase text-slate-400">
                <tr>
                  <th className="py-2 pr-4">
                    <button onClick={() => toggleSort("title")}>
                      Title {sortKey === "title" ? (sortAsc ? "↑" : "↓") : ""}
                    </button>
                  </th>
                  <th className="py-2 pr-4">
                    <button onClick={() => toggleSort("client")}>
                      Client {sortKey === "client" ? (sortAsc ? "↑" : "↓") : ""}
                    </button>
                  </th>
                  <th className="py-2 pr-4">
                    <button onClick={() => toggleSort("amount")}>
                      Amount {sortKey === "amount" ? (sortAsc ? "↑" : "↓") : ""}
                    </button>
                  </th>
                  <th className="py-2 pr-4">Invoiced</th>
                  <th className="py-2 pr-4">Started</th>
                  <th className="py-2 pr-4">Completed</th>
                  <th className="py-2 pr-4">Paid</th>
                </tr>
              </thead>
              <tbody>
                {sortedJobs.map((job) => (
                  <tr key={job.id} className="border-t border-slate-800">
                    <td className={`py-3 pr-4 ${job.completed ? "line-through text-slate-500" : ""}`}>
                      {job.title}
                    </td>
                    <td className="py-3 pr-4">{job.client}</td>
                    <td className="py-3 pr-4">R {job.amount.toFixed(2)}</td>
                    <td className="py-3 pr-4">
                      <input
                        type="checkbox"
                        checked={job.invoiced}
                        onChange={() => toggleJob(job.id, "invoiced")}
                        className="h-4 w-4 accent-emerald-400"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        type="checkbox"
                        checked={job.started}
                        onChange={() => toggleJob(job.id, "started")}
                        className="h-4 w-4 accent-emerald-400"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        type="checkbox"
                        checked={job.completed}
                        onChange={() => toggleJob(job.id, "completed")}
                        className="h-4 w-4 accent-emerald-400"
                      />
                    </td>
                    <td className="py-3 pr-4">
                      <input
                        type="checkbox"
                        checked={job.paid}
                        onChange={() => toggleJob(job.id, "paid")}
                        className="h-4 w-4 accent-emerald-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
