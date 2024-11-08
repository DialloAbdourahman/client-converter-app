import { Resource } from "../types/entities";
import { formatDate, formatSize } from "../utils/helpers";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { VideoStates } from "../utils/video-states";
import { useGetResources, useRetryResource } from "../api/ResourceApi";
import { Link } from "react-router-dom";

export const statuses: { [key: string]: string } = {
  [VideoStates.COMPLETE]: "text-green-700 bg-green-50 ring-green-600/20",
  [VideoStates.UPLOADED]: "text-gray-600 bg-gray-50 ring-gray-500/10",
  [VideoStates.FAILED]: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  item: Resource;
  page: number;
  setToBeDeletedResource: React.Dispatch<React.SetStateAction<Resource | null>>;
};

const SingleResource = ({ item, page, setToBeDeletedResource }: Props) => {
  const { getResources } = useGetResources();
  const { loading, retry } = useRetryResource();

  const resource = item.resource;

  return (
    <li
      key={resource.id}
      className="flex items-center justify-between gap-x-6 py-5"
    >
      <div className="min-w-0">
        <div className="flex items-start gap-x-3">
          <p className="text-sm/6 font-semibold text-gray-900">
            {resource.name.length <= 15
              ? resource.name
              : `${resource.name.slice(0, 15)}...`}
          </p>
          <p
            className={classNames(
              statuses[resource.status],
              "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
            )}
          >
            {resource.status}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
          <p className="whitespace-nowrap">
            Uploaded on{" "}
            <time dateTime={resource.createdAt}>
              {formatDate(resource.createdAt)}
            </time>
          </p>
          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
            <circle r={1} cx={1} cy={1} />
          </svg>
          <p className="truncate">Size {formatSize(resource.size)}</p>
        </div>
      </div>
      <div className="flex flex-none items-center gap-x-4">
        <a
          href={
            resource.status === VideoStates.COMPLETE
              ? item.audioUrl
              : item.videoUrl
          }
          target="_blank"
          className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
        >
          {resource.status === VideoStates.COMPLETE
            ? "Preview audio"
            : "Preview video"}
          <span className="sr-only">, {resource.name}</span>
        </a>
        <Menu as="div" className="relative flex-none">
          <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
          </MenuButton>
          <MenuItems
            transition
            className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
          >
            <MenuItem>
              <Link
                to={`/resource/${resource.id}`}
                className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none w-full text-left cursor-pointer"
              >
                View more
              </Link>
            </MenuItem>
            {resource.status !== VideoStates.UPLOADED && (
              <>
                {resource.status === VideoStates.COMPLETE && (
                  <MenuItem>
                    <a
                      href={item.audioUrl}
                      className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none w-full text-left cursor-pointer"
                    >
                      Download
                    </a>
                  </MenuItem>
                )}
                {resource.status === VideoStates.FAILED && !loading && (
                  <MenuItem>
                    <button
                      onClick={async () => {
                        await retry(resource.id);
                        await getResources(page);
                      }}
                      className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none w-full text-left cursor-pointer"
                    >
                      Retry
                    </button>
                  </MenuItem>
                )}
                <MenuItem>
                  <button
                    onClick={() => setToBeDeletedResource(item)}
                    className="block px-3 py-1 text-sm/6 text-gray-900 data-[focus]:bg-gray-50 data-[focus]:outline-none w-full text-left"
                  >
                    Delete
                    <span className="sr-only">, {resource.name}</span>
                  </button>
                </MenuItem>
              </>
            )}
          </MenuItems>
        </Menu>
      </div>
    </li>
  );
};

export default SingleResource;
