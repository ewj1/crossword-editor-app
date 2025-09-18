import { Grid } from "./components/Grid";

export default function App() {
  return (
    <>
      <div className="flex justify-center">
        <Grid numRows={15} numCols={15}></Grid>
      </div>
    </>
  );
}
