import { Grid } from "./components/Grid";

export default function App() {
  return (
    <>
      <div className="flex justify-center">
        <Grid numRows={20} numCols={20}></Grid>
      </div>
    </>
  );
}
