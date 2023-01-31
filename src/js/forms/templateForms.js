const mainForm = `
  <div class="operation" id="player">
    <div class="score current-score">0</div>
    <div class="controls">
      <button data-id="action-restart" class="btn">New Game</button>
      <button data-id="action-save" class="btn">Save Game</button>
      <button data-id="action-load" class="btn">Load Game</button>
      <button data-id="action-demo" class="btn">Demo Game</button>
    </div>
    <div class="score high-score">0</div>
  </div>
  <div class="game-info">
    <div class="turn-counter"></div>
    <div class="game-stage"></div>
    <div class="game-timer"></div>
  </div>
  <div class="board-container">
    <div class="sidebar player"></div>
    <div class="board-inner">
      <div data-id="board" class="board"id="enemy"></div>
    </div>
    <div class="sidebar enemy"></div>
    <div class="modal"></div>
  </div>
  `;
const newGameForm = `
          <div class="modal-dialog">
            <div class="modal-content">
              <form class="form" id="game-params-form">
                <div class="horm-header">Выбрать сторону</div>
                <div class="form-group">
                  <input type="radio" class="form-control side" name="side" id="good" value="good" checked>
                  <label for="good">Good</label>
                  <input type="radio" class="form-control side" name="side" id="evil" value="evil">
                  <label for="evil">Evil</label>
                </div>
                <div class="params-container">
                  <div class="horm-header">Размер игрового поля</div>
                  <div class="board-size">8</div>
                </div>
                <div class="form-group">
                  <input type="range" class="form-control" id="board-size-control" name="boardSize" min="4" max="16" value="8" step="1">
                </div>
                <div class="params-container">
                  <div class="horm-header">Количество персонажей в команде</div>
                  <div class="team-size">2</div>
                </div>
                <div class="form-group">
                  <input type="range" class="form-control" id="team-size-control" name="teamSize" min="2" max="16" value="2" step="1">
                </div>
                <div class="form-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-primary" form="game-params-form">New Game</button>
                </div>
              </form>
            </div>
        </div>`;

const loadGameForm = `
          <div class="modal-dialog">
            <div class="modal-content">
              <form class="form" id="game-params-form">
                <div class="horm-header">Загрузить сохраненную игру</div>
                <div class="save-name">
                  <select class="load-container" name="load-input"></select>
                  <button type="submit" class="btn btn-primary" form="game-params-form">Load</button>
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
              </form>
            </div>
          </div>`;

const saveGameForm = `
          <div class="modal-dialog">
            <div class="modal-content">
              <form class="form" id="game-params-form">
                <div class="horm-header">Сохранить игру</div>
                <h4>Save Game List</h4>
                <ol class="save-container"></ol>
                <div class="save-name">
                  <input type="text" class="save-input" name="save-input" placeholder="Enter save name..." required>
                  <button type="submit" class="btn btn-primary" form="game-params-form">Save</button>
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
              </form>
            </div>
        </div>`;

const winPlayerForm = `
        <div class="modal-dialog">
        <div class="modal-content">
          <form class="form" id="game-params-form">
            <div class="horm-header">Player wins!</div>
            <div class="params-container">
              <div class="horm-header">Total score</div>
              <div class="total-score"></div>
            </div>
            <div class="form-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Next</button>
              <!--<button type="submit" class="btn btn-primary" form="game-params-form">Next</button>-->
            </div>
          </form>
        </div>
        </div>`;

const gameOverForm = `
        <div class="modal-dialog">
        <div class="modal-content">
          <form class="form" id="game-params-form">
            <div class="horm-header">Game over</div>
            <div class="params-container">
              <div class="horm-header">Total score</div>
              <div class="total-score"></div>
            </div>
            <div class="form-footer">
              <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
              <button type="submit" class="btn btn-primary" form="game-params-form">New Game</button>
            </div>
          </form>
        </div>
        </div>`;

export default function formSelector(formName) {
	return {
		main: mainForm,
		winPlayer: winPlayerForm,
		gameOver: gameOverForm,
		newGame: newGameForm,
		saveGame: saveGameForm,
		loadGame: loadGameForm,
	} [formName];
}