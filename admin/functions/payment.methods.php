<?php
class Payment_Methods_Manager {
    
    private $option_name = 'juzt_payment_methods';
    
    /**
     * Obtener todos los registros
     */
    public function get_all() {
        $data = get_option($this->option_name, []);
        return is_array($data) ? $data : [];
    }
    
    /**
     * Obtener por ID
     */
    public function get_by_id($id) {
        $all = $this->get_all();
        
        foreach ($all as $item) {
            if ($item['id'] == $id) {
                return $item;
            }
        }
        
        return null;
    }
    
    /**
     * Crear nuevo registro
     */
    public function create($data) {
        $all = $this->get_all();
        
        // Auto-increment ID
        $max_id = 0;
        foreach ($all as $item) {
            if ($item['id'] > $max_id) {
                $max_id = $item['id'];
            }
        }
        
        $new_item = [
            'id' => $max_id + 1,
            'image' => $data['image'] ?? null,
            'name' => $data['name'] ?? '',
            'bank' => $data['bank'] ?? '',
            'account' => $data['account'] ?? '',
            'type' => $data['type'] ?? ''
        ];
        
        $all[] = $new_item;
        
        update_option($this->option_name, $all);
        
        return $new_item;
    }
    
    /**
     * Actualizar registro
     */
    public function update($id, $data) {
        $all = $this->get_all();
        $found = false;
        
        foreach ($all as $key => $item) {
            if ($item['id'] == $id) {
                $all[$key] = array_merge($item, $data);
                $all[$key]['id'] = $id; // Mantener ID original
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            return false;
        }
        
        update_option($this->option_name, $all);
        
        return $all[$key];
    }
    
    /**
     * Eliminar registro
     */
    public function delete($id) {
        $all = $this->get_all();
        $new_array = [];
        $deleted = false;
        
        foreach ($all as $item) {
            if ($item['id'] == $id) {
                $deleted = true;
                continue; // Saltar este elemento
            }
            $new_array[] = $item;
        }
        
        if (!$deleted) {
            return false;
        }
        
        update_option($this->option_name, $new_array);
        
        return true;
    }
}