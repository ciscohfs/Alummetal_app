from kivy.app import App
from kivy.lang import Builder
from kivy.properties import BooleanProperty, StringProperty
from kivy.uix.screenmanager import Screen
from kivy.uix.button import Button
from kivy.properties import ListProperty
from kivy.core.window import Window
import arabic_reshaper
from bidi.algorithm import get_display


class HomeScreen(Screen):
    pass


class GlassButton(Button):
    card_color = ListProperty([0.12, 0.25, 0.35, 0.72])


class MainApp(App):
    is_english = BooleanProperty(False)
    font_name = StringProperty("Yekan.ttf")

    def build(self):
        self.title = "آلوم متال آراک"
        Window.size = (390, 820)
        Window.minimum_width = 360
        Window.minimum_height = 700
        return Builder.load_file("home.kv")

    def rtl(self, text):
        return get_display(arabic_reshaper.reshape(text))

    def toggle_language(self):
        self.is_english = not self.is_english
        self.title = "Alum Metal Arak" if self.is_english else "آلوم متال آراک"


if __name__ == "__main__":
    MainApp().run()
