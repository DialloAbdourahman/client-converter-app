import { useEffect, useState } from "react";
import { useGetResource, useRetryResource } from "../api/ResourceApi";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import FullPageLoadingSkeleton from "../components/loading/FullPageLoadingSkeleton";
import EmptyList from "../components/EmptyList";
import { formatDate, formatSize } from "../utils/helpers";
import { classNames, statuses } from "../components/SingleResource";
import { VideoStates } from "../utils/video-states";
import { Resource as ResourceType } from "../types/entities";
import DeleteResourceModal from "../components/DeleteResourceModal";

const Resource = () => {
  const { id } = useParams();
  const { loading, getResource, notFound, resource } = useGetResource();
  const [toBeDeletedResource, setToBeDeletedResource] =
    useState<ResourceType | null>(null);
  const { loading: loadingRetry, retry } = useRetryResource();

  useEffect(() => {
    if (id) {
      getResource(id);
    }
  }, [id]);

  return (
    <>
      <Navbar />
      {loading && <FullPageLoadingSkeleton items={10} />}
      {!loading && notFound && (
        <EmptyList
          title="Resource does not exist"
          description="You resource information will be displayed here"
        />
      )}
      {!loading && !notFound && resource && (
        <div className="px-8 pt-8 lg:px-12">
          {resource.resource.status === VideoStates.COMPLETE && (
            <div className=" mb-8">
              <h3 className="text-base/7 font-semibold text-gray-900 mb-4">
                Audio preview
              </h3>
              <audio src={resource.audioUrl} controls></audio>
            </div>
          )}

          <div className="px-4 sm:px-0">
            <h3 className="text-base/7 font-semibold text-gray-900">
              Resource Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
              More details about the video/resource information.
            </p>
          </div>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">Title</dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {resource.resource.name}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">
                  Video size
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {formatSize(resource.resource.size)}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">
                  Upload date
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {formatDate(resource.resource.createdAt)}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">
                  Status of the resource
                </dt>
                <dd className="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
                  <span
                    className={classNames(
                      statuses[resource.resource.status],
                      "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    )}
                  >
                    {resource.resource.status}
                  </span>
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm/6 font-medium text-gray-900">Actions</dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  {resource.resource.status === VideoStates.COMPLETE && (
                    <a
                      href={resource.audioUrl}
                      target="_blank"
                      className="rounded bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-4 cursor-pointer"
                    >
                      Download
                    </a>
                  )}
                  {resource.resource.status === VideoStates.FAILED && (
                    <button
                      onClick={async () => {
                        if (!loadingRetry) {
                          await retry(resource.resource.id);
                          await getResource(id as string);
                        }
                      }}
                      className="rounded bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-4 cursor-pointer"
                    >
                      {loadingRetry ? "Loading..." : "Retry"}
                    </button>
                  )}
                  {(resource.resource.status === VideoStates.COMPLETE ||
                    resource.resource.status === VideoStates.FAILED) && (
                    <button
                      onClick={async () => {
                        setToBeDeletedResource(resource);
                      }}
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto ml-4"
                    >
                      Delete
                    </button>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
      <DeleteResourceModal
        toBeDeletedResource={toBeDeletedResource}
        setToBeDeletedResource={setToBeDeletedResource}
        shouldNavigate={true}
      />
    </>
  );
};

export default Resource;
