// app/error.tsx
// router 단위로도 사용할수 있음 - 검색해보기
'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('에러 발생:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl text-red-500 font-bold">문제가 발생했습니다</h1>
      <p className="mt-2 text-gray-600">잠시 후 다시 시도해주세요.</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        다시 시도
      </button>
    </div>
  );
}