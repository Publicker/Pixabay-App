import React from "react";
import { useState } from "react";
import { StyleSheet, View, Text, Image, FlatList } from "react-native";
import { ImageJsonResult } from "../models";
import { getImages } from "../services/pixabay";

interface IGrid {
  rows?: IRow[];
}

interface IRow {
  columns: IColumn[];
  index: string;
}

interface IColumn {
  insideImages: ImageJsonResult[];
}

export default function ListPhotos() {
  const [images, setImages] = useState<ImageJsonResult[]>([]);
  const [grid, setGrid] = useState<IGrid>({});
  const [page, setPage] = useState<number>(1);
  const [allPagesShown, setAllPagesShown] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchImages = async (page: number = 1) => {
    const fetchedImages = await getImages({ page });

    if (fetchedImages.length <= 0) {
      setAllPagesShown(true);
    }

    return fetchedImages;
  };

  const onInitialLoad = async () => {
    const fetchedImages = await fetchImages(page);
    setImages(fetchedImages);
  };

  React.useEffect(() => {
    onInitialLoad();
  }, []);

  React.useEffect(() => {
    if (!images || images.length <= 0) {
      return;
    }

    // Generate grid
    let rows: IRow[] = [];
    const imagesCopy: ImageJsonResult[] = [...images];

    // Used for doing logic of double row
    let isDoubleRow = true;
    let isLeft = false;

    for (let i = 0; i < imagesCopy.length; i++) {
      const row: IRow = {
        columns: [
          {
            insideImages: [
              imagesCopy[0],
              ...(isDoubleRow && isLeft ? [imagesCopy[1]] : []),
            ],
          },
          {
            insideImages: [
              ...(isDoubleRow && isLeft ? [imagesCopy[2]] : []),
              ...(!isDoubleRow ? [imagesCopy[1]] : []), // normal row
              ...(isDoubleRow && !isLeft ? [imagesCopy[1], imagesCopy[2]] : []), // triple row at right
            ],
          },
        ],
        index: `row-${i}`,
      };

      rows.push(row);

      imagesCopy?.splice(0, isDoubleRow ? 3 : 2);
      if (isDoubleRow) {
        isLeft = !isLeft;
      }

      isDoubleRow = !isDoubleRow;
    }

    setGrid({ rows });
  }, [images]);

  const onLoadMoreImages = async () => {
    if (!isLoading && !allPagesShown) {
      setIsLoading(true);
      const fetchedImages = await fetchImages(page + 1);
      setPage(page + 1);

      setImages((images) => {
        return [...images, ...fetchedImages];
      });

      setIsLoading(false);
    }
  };

  const renderRow = ({ item: row }: { item: IRow }) => {
    return (
      <View key={row.index} style={styles.row}>
        {/* Iteration over columns inside a row */}
        {row.columns.map((column, columnIndex) => {
          return renderColumn(column, row.index, columnIndex);
        })}
      </View>
    );
  };

  const renderColumn = (
    column: IColumn,
    rowIndex: string,
    columnIndex: number
  ) => {
    // INDIVIDUAL IMAGE INSIDE A COLUMN
    if (column.insideImages.length === 1) {
      return (
        <View
          style={[styles.column, { alignItems: "center" }]}
          key={`hw-${column.insideImages[0].id}`}
        >
          <View style={styles.imageVerticalContainer}>
            <Image
              style={styles.image}
              source={{
                uri: column.insideImages[0].largeImageURL,
              }}
            />
          </View>
        </View>
      );
    }

    // 2 IMAGES INSIDE A COLUMN
    if (column.insideImages.length > 1) {
      return (
        <View
          key={`row-${rowIndex}-column-${columnIndex}`}
          style={styles.imageHorizontalWrapper}
        >
          {/* Iteration over images inside column */}
          {column.insideImages.map((columnRow) => {
            return (
              <View
                key={`hw-${columnRow.id}`}
                style={styles.imageHorizontalContainer}
              >
                <Image
                  style={styles.image}
                  source={{
                    uri: columnRow.largeImageURL,
                  }}
                />
              </View>
            );
          })}
        </View>
      );
    }
  };

  const renderFooter = () => {
    return <Text style={styles.footerDot}>{"\u2B24"}</Text>;
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={grid.rows}
      renderItem={renderRow}
      keyExtractor={(row) => row.index}
      onEndReachedThreshold={0.5}
      onEndReached={onLoadMoreImages}
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    height: 250,
  },
  column: {
    flex: 1,
    paddingVertical: 15,
  },
  imageVerticalContainer: {
    backgroundColor: "transparent",
    width: "100%",
    height: "100%",
    paddingHorizontal: 15,
  },
  imageHorizontalWrapper: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  imageHorizontalContainer: {
    height: "45%",
    backgroundColor: "transparent",
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    borderRadius: 10,
  },
  footerDot: {
    margin: "auto",
    textAlign: "center",
    color: "#C3C3C3",
    marginBottom: 15,
  },
});
