import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/splide/css'; // デフォルトのテーマを読み込んでいます（コアスタイルのみ読み込む設定も可能）

export const Slider1 = () => {
  return (
    <>
      <Splide
        options={{
          type: 'loop',
          autoplay: true, //自動スライドのON/OFF
          speed:800, //スライドにかける時間
          interval: 5000, //スライドする間隔
          perPage: 1, //一度表示する枚数
          perMove: 1, //一度にスライドする枚数
          gap: '1rem',
        }}
      >
        <SplideSlide>
          <img src="/testimage1.jpg" alt="Image 1" className="w-full h-112 object-cover" />
        </SplideSlide>
        <SplideSlide>
          <img src="/testimage2.jpg" alt="Image 2" className="w-full h-112 object-cover" />
        </SplideSlide>
        <SplideSlide>
          <img src="/testimage3.jpg" alt="Image 3" className="w-full h-112 object-cover" />
        </SplideSlide>
      </Splide>
    </>
  );
};

export const Slider2 = () => {
  return (
    <>
      <Splide
        options={{
          type: 'loop',
          autoplay: true, //自動スライドのON/OFF
          speed:800, //スライドにかける時間
          interval: 5000, //スライドする間隔
          perPage: 1, //一度表示する枚数
          perMove: 1, //一度にスライドする枚数
          gap: '1rem',
        }}
      >
        <SplideSlide>
          <img src="/testimage1.jpg" alt="Image 1" className="w-full h-112 object-cover" />
        </SplideSlide>
        <SplideSlide>
          <img src="/testimage2.jpg" alt="Image 2" className="w-full h-112 object-cover" />
        </SplideSlide>
        <SplideSlide>
          <img src="/testimage3.jpg" alt="Image 3" className="w-full h-112 object-cover" />
        </SplideSlide>
      </Splide>
    </>
  );
};