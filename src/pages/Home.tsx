import { PlusIcon } from "@heroicons/react/20/solid";
import Navbar from "../components/Navbar";
import { useGetResources } from "../api/ResourceApi";
import FullPageLoadingSkeleton from "../components/loading/FullPageLoadingSkeleton";
import { useEffect, useState } from "react";
import EmptyList from "../components/EmptyList";
import UploadResourceModal from "../components/UploadResourceModal";
import { ResourceInitialStateType } from "../store/resource.slice";
import { useSelector } from "react-redux";
import SingleResource from "../components/SingleResource";
import { Resource } from "../types/entities";
import DeleteResourceModal from "../components/DeleteResourceModal";
import Pagination from "../components/Pagination";

export default function Home() {
  const { getResources } = useGetResources();
  const [uploadVideo, setUploadVideo] = useState<boolean>(false);
  const [toBeDeletedResource, setToBeDeletedResource] =
    useState<Resource | null>(null);
  const [page, setPage] = useState(1);

  const { resources, loadingResources }: ResourceInitialStateType = useSelector(
    (state: any) => state.resourceSlice as ResourceInitialStateType
  );

  useEffect(() => {
    getResources(page);
  }, [page]);

  return (
    <section className=" bg-white">
      <Navbar />
      <div className="relative isolate px-8 pt-14 lg:px-12 mt-10">
        {loadingResources && <FullPageLoadingSkeleton items={10} />}
        {!loadingResources && !resources && <h1>Something went wrong</h1>}
        {!loadingResources && resources && resources.data.length === 0 && (
          <EmptyList
            title="No resources found"
            description="Upload a video and after conversion, it will appear here."
            buttonTitle="Upload a video"
            action={() => setUploadVideo(true)}
          />
        )}
        {!loadingResources && resources && resources.data.length > 0 && (
          <>
            <div className=" flex justify-end  ">
              <button
                onClick={() => setUploadVideo(true)}
                type="button"
                className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Upload a video
                <PlusIcon aria-hidden="true" className="-mr-0.5 h-5 w-5" />
              </button>
            </div>
            <div className=" flex justify-end">
              <button
                type="button"
                onClick={() => getResources(page)}
                className="rounded bg-indigo-50 px-2 py-1 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100 mt-4"
              >
                Refresh
              </button>
            </div>
            <ul
              role="list"
              className="divide-y divide-gray-100 relative isolate px-8 pt-8 lg:px-12 "
            >
              {resources.data.map((item) => {
                return (
                  <SingleResource
                    key={item.resource.id}
                    item={item}
                    setToBeDeletedResource={setToBeDeletedResource}
                    page={page}
                  />
                );
              })}
            </ul>
            <Pagination
              page={page}
              totalPages={resources.totalPages}
              setPage={setPage}
            />
          </>
        )}
      </div>
      <UploadResourceModal open={uploadVideo} setOpen={setUploadVideo} />
      <DeleteResourceModal
        toBeDeletedResource={toBeDeletedResource}
        setToBeDeletedResource={setToBeDeletedResource}
      />
    </section>
  );
}
