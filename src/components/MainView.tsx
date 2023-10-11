import { FormEventHandler, UIEventHandler, useEffect, useState } from 'react';
import AppToolbar from './AppToolbar';
import BookmarksView from './BookmarksView';

function useBookmarksFolder(folderName: string) {
  const [bookmarks, setBookmarks] = useState<
    chrome.bookmarks.BookmarkTreeNode[]
  >([]);

  const updateBookmarks = (folder: chrome.bookmarks.BookmarkTreeNode) => {
    setBookmarks(folder.children || []);
  };

  useEffect(() => {
    function getBookmarks() {
      // Search bookmarks for folder
      chrome.bookmarks.search(
        {
          url: undefined,
          title: folderName,
        },
        results => {
          // If results, parse bookmarks
          results.length &&
            chrome.bookmarks.getSubTree(results[0].id, data =>
              updateBookmarks(data[0]),
            );

          // Fallback to Bookmarks Bar
          !results.length &&
            chrome.bookmarks.getSubTree('1', data => updateBookmarks(data[0]));
        },
      );
    }

    // Add event listeners
    if (chrome) {
      chrome.bookmarks.onCreated.addListener(getBookmarks);
      chrome.bookmarks.onRemoved.addListener(getBookmarks);
      chrome.bookmarks.onChanged.addListener(getBookmarks);
      chrome.bookmarks.onMoved.addListener(getBookmarks);
      if (chrome.bookmarks.onChildrenReordered) {
        chrome.bookmarks.onChildrenReordered.addListener(getBookmarks);
      }
    }

    // get bookmarks
    getBookmarks();

    return function cleanup() {
      // Remove event listeners
      if (chrome) {
        chrome.bookmarks.onCreated.removeListener(getBookmarks);
        chrome.bookmarks.onRemoved.removeListener(getBookmarks);
        chrome.bookmarks.onChanged.removeListener(getBookmarks);
        chrome.bookmarks.onMoved.removeListener(getBookmarks);
        if (chrome.bookmarks.onChildrenReordered) {
          chrome.bookmarks.onChildrenReordered.removeListener(getBookmarks);
        }
      }
    };
  }, [folderName]);

  return bookmarks;
}

function MainView({ folderName = '_Swift' }: { folderName?: string }) {
  const bookmarks = useBookmarksFolder(folderName);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange: FormEventHandler<HTMLInputElement> = event =>
    setSearchQuery((event.target as HTMLInputElement).value.toLowerCase());

  const handleScrollChange: UIEventHandler<HTMLDivElement> = event => {
    const isScrolledCurrent =
      (event.target as HTMLDivElement).scrollTop > 0 ? true : false;
    isScrolledCurrent !== isScrolled && setIsScrolled(isScrolledCurrent);
  };

  const filterBookmarks = (
    bookmarks: chrome.bookmarks.BookmarkTreeNode[],
    filter: string,
  ) => {
    // Clone bookmarks
    bookmarks = JSON.parse(JSON.stringify(bookmarks));

    // Filter bookmarks
    const bookmarksFiltered = bookmarks
      .map(folder => {
        folder.children &&
          (folder.children = folder.children.filter(bookmark =>
            filter
              ? bookmark.url && bookmark.title.toLowerCase().includes(filter)
              : bookmark.url,
          ));
        return folder;
      })
      .filter(folder => folder.children && folder.children.length);

    return bookmarksFiltered;
  };

  const bookmarksFiltered = filterBookmarks(bookmarks, searchQuery);

  const msg = searchQuery ? (
    <div className="no-bookmarks">No search results found</div>
  ) : (
    <div className="no-bookmarks fadein">
      Bookmarks in <strong>Bookmarks Bar</strong> or{' '}
      <strong>{folderName}</strong> appear here
    </div>
  );

  const bookmarksView = !bookmarksFiltered.length ? (
    msg
  ) : (
    <BookmarksView
      data={bookmarksFiltered}
      handleScrollChange={handleScrollChange}
    />
  );

  return (
    <div className="App">
      <AppToolbar
        handleSearchChange={handleSearchChange}
        searchValue={searchQuery}
        shadow={isScrolled}
      />
      {bookmarksView}
    </div>
  );
}

export default MainView;
