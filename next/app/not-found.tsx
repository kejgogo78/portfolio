import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-xl text-gray-700">페이지를 찾을 수 없습니다.</p>
      <Link
        href="/"
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        메인 페이지로 돌아가기
      </Link>
    </div>
  );
}
