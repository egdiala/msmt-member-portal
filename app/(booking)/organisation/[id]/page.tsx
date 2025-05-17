import { SingleOrganisationProviderContent } from "@/components/custom";

const SingleOrganisationProvider = () => {
  return (
    <div className="grid gap-y-4">
      <SingleOrganisationProviderContent isPublic={true} />
    </div>
  );
};

export default SingleOrganisationProvider;
