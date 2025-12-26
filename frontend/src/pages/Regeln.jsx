// src/pages/Regeln.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/regeln.css';

function Regeln() {
  const [modalImage, setModalImage] = useState(null);

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="regeln">
      <Link to="/" className="regeln__back-link">← Zurück zur Startseite</Link>
      <h1>🎯 Spielregeln</h1>

      <section className="regeln__intro">
        <p>
          Für dieses Spiel benötigt man das Kartenspiel <a href="https://amzn.eu/d/eReStgf" target="_blank" rel="noopener noreferrer" className="regeln__external-link"><strong>11er Raus</strong> 🔗</a>. <strong>Stechen</strong> ist ein Spiel für mind. 2 und maximal 11 Personen. Den meisten Spielspaß hat man allerdings erst ab mindestens drei Personen.
        </p>
        <p>
          Ziel dieses Spieles ist es, durch die geschickte Analyse seiner Karten und die Ansage seiner zu erwartenden Stiche eine bestimmte Punktzahl als Erstes so schnell wie möglich zu erreichen.
        </p>
      </section>

      <section className="regeln__grundlagen">
        <h2>Die Regeln des Spiels <em>Stechen</em></h2>
        <div className="regeln__content-with-image">
          <a href="#" onClick={(e) => { e.preventDefault(); openModal('https://placehold.co/600x400'); }} className="regeln__image-link">
            <img src="https://placehold.co/150x150" alt="Kartenspiel Stechen" className="regeln__initial-image" />
            <div className="regeln__image-caption">Klicken zum Vergrößern</div>
          </a>
          <div className="regeln__text-content">
            <p>
              Das <strong>11er Raus</strong> Kartenspiel besteht aus 80 Karten, aufgeteilt in 4 Farben, rot, gelb, grün und blau, zu Werten von 1-20. Daher ergibt sich auch die Höchstgrenze für Mitspieler: 11 Spieler je 7 Karten = 77 Karten, drei rest im Stack. Davon eine Karte als Trumpf-Karte = 78 Karten, zwei verbleibende.
            </p>
            <p>
              Je nach Anzahl der Spieler gibt es unterschiedliche Anzahl von Karten, die die Spieler zu Beginn erhalten:
            </p>
            <ul>
              <li><strong>2 - 6 Spieler:</strong> 9 Karten</li>
              <li><strong>7 - 11 Spieler:</strong> 7 Karten</li>
            </ul>
            <p>
              Die restlichen Karten verbleiben als Stapel, wobei noch EINE Karte als Trumpfkarte/Trumpf-Farbe aufgedeckt auf den Stapel gelegt wird.
            </p>
            <p>
              Zu Beginn des Spieles wird der Kartengeber (Dealer) bestimmt, danach wechselt dieser pro Spielrunde im Uhrzeigersinn. Der Dealer mischt die Karten und teilt sie aus. Danach wird die Trumpfkarte aufgedeckt. Eine Runde besteht aus drei Spielabschnitten, die nun näher erläutert werden.
            </p>
          </div>
        </div>
      </section>

      <section className="regeln__ansagen">
        <h3>Das Ansagen</h3>
        <p>
          <a href="#" onClick={(e) => { e.preventDefault(); openModal('https://placehold.co/600x400'); }} className="regeln__image-link">
            <img src="https://placehold.co/150x150" alt="Ansagen im Stechen-Spiel" className="regeln__section-image" />
            <div className="regeln__image-caption">Klicken zum Vergrößern</div>
          </a>
          In diesem Spielabschnitt startet der Spieler <strong>links vom Dealer</strong> mit den Ansagen. Einen sogenannten <em>Stich</em> kann man machen, wenn man mit der ausgespielten Farbe die höchste Zahl selbst hat oder, wenn die ausgespielte Karte keine Trumpf-Farbe ist, die höchste Trumpf-Farbe-Karte auf den Tisch legt. Entscheidend ist, dass man die Farbe, die ausgespielt wurde, bedienen muss, es sei denn, man hat diese Farbe nicht. Dann kann man entweder eine Trumpf-Farbe legen und so eventuell den Stich zu bekommen oder eine andere Farbe abwerfen. Mit diesem Hintergrund <em>schätzt</em> der Spieler, wie viele Stiche er mit seinen Karten bekommt. Es sind Ansagen von 0 bis 7 (oder 9 bei Spieleranzahl kleiner als sieben) möglich.
        </p>
        <p>
          Hierbei kommt auch die strategische Komponente ins Spiel, denn die nachfolgenden Spieler können die Ansagen der Vorherigen sehen und so ihre eigene Ansage anpassen.
        </p>
        <p>
          Der Schriftführer notiert die Ansagen nach und nach auf seinem Zettel (später in der App) und nachdem der Dealer seine Ansage gemacht hat, startet der zweite Abschnitt:
        </p>
      </section>

      <section className="regeln__spielen">
        <h3>Das Spielen</h3>
        <p>
          <a href="#" onClick={(e) => { e.preventDefault(); openModal('https://placehold.co/600x400'); }} className="regeln__image-link">
            <img src="https://placehold.co/150x150" alt="Spielen im Stechen-Spiel" className="regeln__section-image" />
            <div className="regeln__image-caption">Klicken zum Vergrößern</div>
          </a>
          Der Spieler <strong>links vom Dealer</strong> beginnt mit dem Ausspielen einer Karte. Dabei ist es vollkommen egal, was für eine Karte er ausspielt (Trumpf-Farbe oder nicht). Alle nachfolgenden Spieler müssen diese Farbe erwidern, sofern sie sie haben. Wenn nicht, darf eine Trumpf-Farbe ausgespielt werden, um zu signalisieren, dass <strong>dieser Spieler</strong> den Stich haben möchte. Er kann aber auch eine andere Farbe abwerfen, wenn er die Farbe nicht bedienen kann. Das bewusste Nichtbedienen ist ein Regelverstoß, der bis zum Spielausschluss geahndet werden kann.
        </p>
        <p>
          Der Spieler, der entweder die höchste Karte der geforderten Farbe <strong>oder</strong> die höchste Trumpf-Farbe gelegt hat bekommt den Stich und ist nun an der Reihe, eine Karte zu legen. Dieses wiederholt sich so lange, bis kein Spieler mehr eine Karte auf der Hand hat. Die Stiche werden sorgfältig auf einem für den Spieler geeigneten Platz so hingelegt, dass man die Zahl der Stiche auf einen Blick sehen kann.
        </p>
        <p>
          Sind alle Stiche ausgespielt, geht es zum dritten Abschnitt:
        </p>
      </section>

      <section className="regeln__auswerten">
        <h3>Das Auswerten</h3>
        <p>
          <a href="#" onClick={(e) => { e.preventDefault(); openModal('https://placehold.co/600x400'); }} className="regeln__image-link">
            <img src="https://placehold.co/150x150" alt="Auswerten im Stechen-Spiel" className="regeln__section-image" />
            <div className="regeln__image-caption">Klicken zum Vergrößern</div>
          </a>
          Der Schriftführer zählt reihum, beginnend vom Spieler <strong>links vom Dealer</strong> die Stiche und vergleicht diese mit den Ansagen. Jeder Stich ist pauschal schon mal ein Punkt wert. Hat der Spieler genauso viele Stiche bekommen, wie er angesagt hat, bekommt dieser einen Bonus von 10 Punkten. Hat der Spieler mehr oder weniger Stiche als angesagt, bekommt er so viele Punkte, wie er Stiche bekommen hat.
        </p>
        <div className="regeln__sonderfall">
          <h4>Sonderfall: 0 Punkte angesagt und eingehalten</h4>
          <p>
            Hat der Spieler 0 Punkte angesagt und auch 0 Punkte erreicht, bekommt er 20 Punkte. Bei Nichteinhalten bekommt er so viele Punkte, wie er Stiche gesammelt hat.
          </p>
        </div>
        <p>
          Der Schriftführer notiert die Punkte auf dem Zettel (später in der App) und zählt die Punkte zusammen. Sobald ein Spieler 100 Punkte + Datum erreicht hat, ist die Runde zu Ende. 100 plus Datum heißt, wenn heute z.B. der 6.11. wäre, dann ist die Gewinnmarke 106 Punkte, die es zu erreichen gilt. Haben mehrere Spieler die Gewinnmarke erreicht, dann ist derjenige Spieler, der diese Marke zuerst erreicht hat, der Gewinner.
        </p>
      </section>

      <section className="regeln__glossar">
        <h2>Glossar der Spielbegriffe</h2>
        <table className="regeln__glossar-table">
          <thead>
            <tr>
              <th>Begriff</th>
              <th>Erklärung</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Stich</strong></td>
              <td>Eine Spielrunde, bei der jeder Spieler eine Karte legt. Der Spieler mit der höchsten Karte der ausgespielten Farbe oder der höchsten Trumpf-Farbe gewinnt den Stich.</td>
            </tr>
            <tr>
              <td><strong>Trumpf-Farbe</strong></td>
              <td>Die zu Beginn jeder Runde durch eine aufgedeckte Karte festgelegte Farbe, die alle anderen Farben schlägt.</td>
            </tr>
            <tr>
              <td><strong>Bedienen</strong></td>
              <td>Die Pflicht, eine Karte der ausgespielten Farbe zu legen, wenn man diese besitzt.</td>
            </tr>
            <tr>
              <td><strong>Dealer</strong></td>
              <td>Der Kartengeber, der die Karten mischt und austeilt. Diese Rolle wechselt nach jeder Runde im Uhrzeigersinn.</td>
            </tr>
            <tr>
              <td><strong>Ansagen</strong></td>
              <td>Die Vorhersage eines Spielers, wie viele Stiche er in einer Runde zu machen glaubt. Basis für die spätere Punkteberechnung.</td>
            </tr>
            <tr>
              <td><strong>Abwerfen</strong></td>
              <td>Das Spielen einer Karte einer anderen Farbe, wenn man die geforderte Farbe nicht bedienen kann.</td>
            </tr>
            <tr>
              <td><strong>Schriftführer</strong></td>
              <td>Die Person, die die Ansagen und Punkte notiert und die Auswertung vornimmt. Diese Person nutzt anstelle von Zettel und Stift die App zum Erfassen der Daten.</td>
            </tr>
            <tr>
              <td><strong>100 plus Datum</strong></td>
              <td>Die Gewinnregel, bei der die zu erreichende Punktzahl 100 plus die Tageszahl des aktuellen Datums ist (z.B. 106 Punkte am 6. eines Monats).</td>
            </tr>
          </tbody>
        </table>
      </section>

      {modalImage && (
        <div className="regeln__modal" onClick={closeModal}>
          <div className="regeln__modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="regeln__modal-close" onClick={closeModal}>×</button>
            <img src={modalImage} alt="Großansicht" className="regeln__modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Regeln;