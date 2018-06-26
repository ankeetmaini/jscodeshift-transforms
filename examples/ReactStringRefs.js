export class Green extends React.Component {
  componentDidMount() {
    console.log(this.hello);
  }
  render() {
    return (
      <h1 ref="hello" className="something">
        Hello
      </h1>
    );
  }
}
