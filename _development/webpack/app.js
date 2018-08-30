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
  let isBarClicking = false;
  let lastCursorPosition = 0;

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

    move();
  }

  /**
   * スクロールバーを動かす
   */
  function move() {
    const SCROLL_VALUE = $SCROLL_WRAPPER.scrollLeft;
    const SCROLL_PERCENTAGE = SCROLL_VALUE / maxScrollValue;
    const TRANSLATE_X = maxMoveBarValue * SCROLL_PERCENTAGE;
    lastBarPosition = TRANSLATE_X;
    $BAR.style.transform = `translateX(${TRANSLATE_X}px)`;
  }

  window.addEventListener('resize', update);
  $SCROLL_WRAPPER.addEventListener('scroll', move);

  /**
   * バーがクリックされたらフラグをtrueにしてカーソルの位置を保持
   */
  $BAR.addEventListener('mousedown', function(event) {
    isBarClicking = true;
    const CURSOR_POSITION = event.pageX;
    lastCursorPosition = CURSOR_POSITION;
  });

  /**
   * mouseupかmouseleaveでクリック状態を解除
   */
  document.body.addEventListener('mouseup', function() {
    if (isBarClicking) isBarClicking = false;
  });
  document.body.addEventListener('mouseleave', function() {
    if (isBarClicking) isBarClicking = false;
  });

  /**
   * バーをクリックした状態でマウスが動いたらスクロールさせる
   */
  document.body.addEventListener('mousemove', function(event) {
    if (isBarClicking) {
      const CURSOR_POSITION = event.pageX;
      const DIFFERENCE = CURSOR_POSITION - lastCursorPosition;
      lastCursorPosition = CURSOR_POSITION;
      let translateX = lastBarPosition + DIFFERENCE;
      if (translateX <= 0) translateX = 0;
      if (translateX >= maxMoveBarValue) translateX = maxMoveBarValue;

      // バーの位置に応じてスクロールさせる
      const BAR_MOVE_PERCENTAGE = translateX / maxMoveBarValue;
      const SCROLL_LEFT = maxScrollValue * BAR_MOVE_PERCENTAGE;
      lastBarPosition = translateX;

      $BAR.style.transform = `translateX(${translateX}px)`;
      $SCROLL_WRAPPER.scrollLeft = SCROLL_LEFT;
    }
  });

  update();
})();
