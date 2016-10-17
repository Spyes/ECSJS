const ClickComponent = ({onClick: onClick, global: global} = {onClick: () => {}, global: false}) => ({
  name: "Click",
  data: {
    onClick,
    global
  }
});
export default ClickComponent;
