import { ClipLoader } from "react-spinners";

// You can define a style object for custom positioning
const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const LoadingSpinner = () => {
  return (
    <div className="spinner-container">
      <ClipLoader
        color="#000000"
        loading={true}
        cssOverride={override}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default LoadingSpinner;
