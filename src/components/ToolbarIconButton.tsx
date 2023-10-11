function IconButton(props: { url: string; icon?: string; title?: string }) {
  const { title, url } = props;

  return (
    <button title={title} onClick={() => chrome.tabs.update({ url })}>
      {title}
    </button>
  );
}

export default IconButton;
