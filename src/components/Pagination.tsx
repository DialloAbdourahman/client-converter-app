import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

type Props = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
};

export default function Pagination({ page, setPage, totalPages }: Props) {
  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          onClick={() => {
            if (page !== 1) {
              setPage(page - 1);
            }
          }}
        >
          <ArrowLongLeftIcon
            aria-hidden="true"
            className="mr-3 h-5 w-5 text-gray-400"
          />
          Previous
        </button>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => {
          return (
            <>
              {item === page ? (
                <button
                  aria-current="page"
                  className="inline-flex items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600"
                >
                  {item}
                </button>
              ) : (
                <button
                  onClick={() => setPage(item)}
                  className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  {item}
                </button>
              )}
            </>
          );
        })}
      </div>
      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
          onClick={() => {
            if (page !== totalPages) {
              setPage(page + 1);
            }
          }}
        >
          Next
          <ArrowLongRightIcon
            aria-hidden="true"
            className="ml-3 h-5 w-5 text-gray-400"
          />
        </button>
      </div>
    </nav>
  );
}
