(function() {
  const $SCROLL_WRAPPER = document.querySelector('.scroll__wrapper');
  const $SCROLL_INNER = $SCROLL_WRAPPER.querySelector('.scroll__inner');
  const $BAR_WRAPPER = document.querySelector('.scroll__bar');
  const $BAR = $BAR_WRAPPER.querySelector('.scroll__bar__controller');

  // スクロール領域の幅
  const INNER_WIDTH = $SCROLL_INNER.offsetWidth;

  /**
   * wrapperWidth : コンテンツの幅
   * maxScrollValue : スクロールの上限値
   * barWidthPercentage : スクロールバーの幅（％）
   * barWidth : スクロールバーの幅（px）
   * maxMoveBarValue : スクロールバーの移動上限値
   */
  let wrapperWidth,
    maxScrollValue,
    barWidthPercentage,
    barWidth,
    maxMoveBarValue;

  let lastBarPosition = 0;
  let lastCursorPosition = 0;
  let dragSpeed = 0;
  let phantomCount = 0;
  let isBarClicking = false;
  let isWrapperClicking = false;
  let isScrollToRight = false;

  /**
   * 各値の更新
   */
  function update() {
    wrapperWidth = $SCROLL_WRAPPER.offsetWidth;
    maxScrollValue = INNER_WIDTH - wrapperWidth;

    barWidthPercentage = wrapperWidth / INNER_WIDTH * 100;
    $BAR.style.width = `${barWidthPercentage}%`;
    barWidth = $BAR.offsetWidth;
    maxMoveBarValue =
      wrapperWidth -
      barWidth -
      parseInt(getComputedStyle($BAR_WRAPPER)['paddingRight']) * 2;

    updateBarPosition();
  }

  /**
   * スクロールバーを動かす
   */
  function updateBarPosition() {
    const SCROLL_VALUE = $SCROLL_WRAPPER.scrollLeft;
    const SCROLL_PERCENTAGE = SCROLL_VALUE / maxScrollValue;
    const TRANSLATE_X = maxMoveBarValue * SCROLL_PERCENTAGE;
    lastBarPosition = TRANSLATE_X;
    $BAR.style.transform = `translateX(${TRANSLATE_X}px)`;
  }

  /**
   * バーがドラッグされた時
   */
  function dragBar() {
    const CURSOR_POSITION = event.pageX;
    const DIFFERENCE = CURSOR_POSITION - lastCursorPosition;
    lastCursorPosition = CURSOR_POSITION;
    let translateX = lastBarPosition + DIFFERENCE;
    if (translateX <= 0) translateX = 0;
    if (translateX >= maxMoveBarValue) translateX = maxMoveBarValue;
    lastBarPosition = translateX;

    // バーの位置に応じてスクロールさせる
    const BAR_MOVE_PERCENTAGE = translateX / maxMoveBarValue;
    const SCROLL_LEFT = maxScrollValue * BAR_MOVE_PERCENTAGE;
    $BAR.style.transform = `translateX(${translateX}px)`;
    $SCROLL_WRAPPER.scrollLeft = SCROLL_LEFT;
  }

  /**
   * コンテンツエリアがドラッグされた時
   */
  function dragContent() {
    const CURSOR_POSITION = event.pageX;
    const DIFFERENCE = CURSOR_POSITION - lastCursorPosition;
    lastCursorPosition = CURSOR_POSITION;
    isScrollToRight = DIFFERENCE < 0 ? true : false;
    dragSpeed = isScrollToRight ? -DIFFERENCE * 1.5 : DIFFERENCE * 1.5;

    const LAST_SCROLL_LEFT = $SCROLL_WRAPPER.scrollLeft;
    let scrollLeft = LAST_SCROLL_LEFT - DIFFERENCE;
    if (scrollLeft <= 0) scrollLeft = 0;
    if (scrollLeft >= maxScrollValue) scrollLeft = maxScrollValue;

    // カーソルの位置に応じてスクロールさせる
    const SCROLL_PERCENTAGE = scrollLeft / maxScrollValue;
    const TRANSLATE_X = maxMoveBarValue * SCROLL_PERCENTAGE;
    $BAR.style.transform = `translateX(${TRANSLATE_X}px)`;
    $SCROLL_WRAPPER.scrollLeft = scrollLeft;
  }

  /**
   * コンテンツエリアのドラッグでスクロールした後の余韻
   */
  function phantomDrag() {
    let scrollValue = isScrollToRight
      ? -dragSpeed + phantomCount * (phantomCount / dragSpeed)
      : dragSpeed - phantomCount * (phantomCount / dragSpeed);
    if (
      (scrollValue > 0 && isScrollToRight) ||
      (scrollValue < 0 && !isScrollToRight)
    )
      scrollValue = 0;

    const LAST_SCROLL_LEFT = $SCROLL_WRAPPER.scrollLeft;
    let scrollLeft = LAST_SCROLL_LEFT - scrollValue;
    if (scrollLeft <= 0) scrollLeft = 0;
    if (scrollLeft >= maxScrollValue) scrollLeft = maxScrollValue;

    const SCROLL_PERCENTAGE = scrollLeft / maxScrollValue;
    const TRANSLATE_X = maxMoveBarValue * SCROLL_PERCENTAGE;

    $BAR.style.transform = `translateX(${TRANSLATE_X}px)`;
    $SCROLL_WRAPPER.scrollLeft = scrollLeft;

    phantomCount += 1 + phantomCount / 100;
    phantomCount >= dragSpeed
      ? window.cancelAnimationFrame(phantomDrag)
      : window.requestAnimationFrame(phantomDrag);
  }

  window.addEventListener('resize', update);
  $SCROLL_WRAPPER.addEventListener('scroll', updateBarPosition);

  /**
   * バーがクリックされたらフラグをtrueにしてカーソルの位置を保持
   */
  $BAR.addEventListener('mousedown', function(event) {
    isBarClicking = true;
    lastCursorPosition = event.pageX;
  });

  /**
   * コンテンツエリアがクリックされたらフラグをtrueにしてカーソルの位置を保持
   */
  $SCROLL_WRAPPER.addEventListener('mousedown', function(event) {
    isWrapperClicking = true;
    lastCursorPosition = event.pageX;
    dragSpeed = 0;
    window.cancelAnimationFrame(phantomDrag);
  });

  /**
   * mouseupかmouseleaveでクリック状態を解除
   */
  document.body.addEventListener('mouseup', function() {
    if (isBarClicking) isBarClicking = false;
    if (isWrapperClicking) {
      isWrapperClicking = false;
      if (dragSpeed !== 0) {
        phantomCount = 0;
        window.requestAnimationFrame(phantomDrag);
      }
    }
  });
  document.body.addEventListener('mouseleave', function() {
    if (isBarClicking) isBarClicking = false;
    if (isWrapperClicking) {
      isWrapperClicking = false;
      if (dragSpeed !== 0) {
        phantomCount = 0;
        if (dragSpeed !== 0) window.requestAnimationFrame(phantomDrag);
      }
    }
  });

  /**
   * バーをクリックした状態でマウスが動いたらスクロールさせる
   */
  document.body.addEventListener('mousemove', function(event) {
    if (isBarClicking) dragBar();
    if (isWrapperClicking) dragContent();
  });

  update();
})();
