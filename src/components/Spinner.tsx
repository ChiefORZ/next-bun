const Spinner = () => (
  <div
    className=" spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-green-500"
    role="status"
  >
    <span className="invisible">Loading...</span>
  </div>
);

export default Spinner;
