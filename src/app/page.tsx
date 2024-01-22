import Image from "next/image";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-2 h-1/2 w-1/2 bg-slate-400 rounded-md p-4">
        <h1>MOC Millenial Indonesia Internship Test</h1>
        <h2>Muhammad Rizky Sya&apos;ban</h2>
        <div className="flex gap-2">
          <a href="/login">
            <button className="flex w-full mt-12 justify-center bg-slate-500 hover:bg-slate-600 rounded-md p-4">
              Login
            </button>
          </a>
          <a href="/register">
            <button className="flex w-full mt-12 justify-center bg-slate-500 hover:bg-slate-600 rounded-md p-4">
              Register
            </button>
          </a>
        </div>
      </div>
    </main>
  );
}
